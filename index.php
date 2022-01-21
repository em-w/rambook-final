<?php
	
	// variables used for post upload and sign up forms
	$name = $desc = $tagstring = $agreement = $connection = $grade = $username = $password = "";
	$tags = array();

	// error messages
	$nameErr = $descErr = $tagsErr= $agreeErr = $connErr = $pfpErr = $userErr = $pwdErr = "";

	$uid = 0; // uid of post/profile
	$imageFileType = ""; // image file type of profile image/post

	$isPfpUploaded = ""; // boolean for whether a profile images is uploaded or not
	
	$error = false;	// boolean for form error checking

	$file = "userprofiles.json"; // json file for storing user data
	$targetDir = "profileimages/"; // directory for storing pfps
	$postDir = "postimages/"; // directory for storing posts
	
	include "createthumbnail.php";

	include "header.inc";

	// if a form was submitted, validate data
	if ($_SERVER["REQUEST_METHOD"] === "POST") {
	
		// if login form is submitted
		if (isset($_POST["login"])) {
			$successful = false; // tracks if login is successful
			if (file_exists($file)) {
				// get json string and decode into php array
				$jsonstring = file_get_contents($file);
				$userprofiles = json_decode($jsonstring, true);

				// run through database of usernames and passwords and
				// check if submitted username/password match
				foreach ($userprofiles as $user) {
					if ($user["username"] == $_POST["username"] && $user["password"] == $_POST["password"]) {
						$_SESSION["loggedIn"] = 1;
						$_SESSION["userUid"] = $user["uid"];
						$_SESSION["userFile"] = $user["uid"] . ".json";
						$successful = true;
					} // if
				} // foreach
			} // if

			// display error message if login is not successful
			if (!$successful) {
				echo "<p>Incorrect username or password, please try again.</p>";
			} // if

		
		// if post upload form is submitted
		} else if (isset($_POST["form"])) {
			
			// format post description
			if (!empty($_POST["desc"])) {
				$desc = format_input($_POST["desc"]); 	
			} // if
			
			// validate post tags 
			if (!empty($_POST["tags"])) {
				$tagstring = format_input($_POST["tags"]);
				// check if there are any special characters in the tags
				if (!preg_match("/^[a-zA-Z0-9-', ]*$/", $tagstring)) {
					$tagsErr = "Sorry, no special characters. Letters, numbers, commas, apostrophes, and dashes only, please.";
					$error = true;
				} // if
			} // if
			
			$signupform = new DOMDocument(); //XXX

			// validate agreement
			// check if agreement is clicked
			if (empty($_POST["agreement"])) {
				$agreeErr = "Please check.";
				$error = true;
			} else {
				$agreement = $_POST["agreement"];
			} // else

			// validate post image
			// check if image is uploaded
			if (empty($_FILES["image"]["name"])) {
				$pfpErr = "Please upload an image for your post.";
				$error = true;
			} else {
				// setting file-related variable
				$uid = file_get_contents("postid.txt");
				$targetFile = $postDir . basename($_FILES["image"]["name"]);
				$imageFileType = strtolower(pathinfo($targetFile, PATHINFO_EXTENSION));
				
				// rename target file to uid
				$targetFile = $postDir . $uid . "." . $imageFileType;

				// check if file is an image
				$check = exif_imagetype($_FILES["image"]["tmp_name"]);
				if (!($check !== false)) {
					$pfpErr = "File is not an image.";
					$error = true;
					
				// check if file already exists
				} else if (file_exists($targetFile)) {
					$pfpErr = "Image already exists.";
					$error = true;
					
				// check if file is too large
				} else if ($_FILES["image"]["size"] > 4000000) {
					$pfpErr = "Sorry, your file is too large. All files must be under 4MB.";
					$error = true;
					
				// check if file is a valid image type
				} else if ($imageFileType !== "jpg" && $imageFileType !== "png" && $imageFileType !== "jpeg") {
					$pfpErr = "Sorry, only .jpg, .jpeg, and .png files are allowed.";
					$error = true;
					
				} // else if
			} // else

		// if logout button is pressed
		} else if (isset($_POST["logout"])) {
			session_unset();
			session_destroy();
		
		// if signup form is submitted
		} else if (isset($_POST["signup"])) {

			// validate name
			// check if name is submitted
			if (empty($_POST["name"])) {
				$nameErr = "Name required.";
				$error = true;
			} else {
				$name = format_input($_POST["name"]);

				// check if name contains non-alphabetic characters (excluding spaces, dashes, and apostrophes)
				if (!preg_match("/^[a-zA-Z-' ]*$/", $name)) {
					$nameErr = "Letters and whitespace only, please.";
					$error = true;
				} // if
			} // else	

			// validate description
			// check if description is submitted
			if (empty($_POST["desc"])) {
				$descErr = "Description required.";
				$error = true;
			} else {
				$desc = format_input($_POST["desc"]);
			} // else

			// validate username
			// check if username is submitted
			if (empty($_POST["username"])) {
				$userErr = "Username required.";
				$error = true;
			} else if (file_exists($file)) {
				$username = format_input($_POST["username"]);
				
				// get json string of user profiles and decode into php array
				$jsonstring = file_get_contents($file);
				$userprofiles = json_decode($jsonstring, true);

				// check if username is unique
				foreach ($userprofiles as $user) {
					if ($user["username"]==$_POST["username"]) {
						$userErr = "This username is already taken! Please choose another.";
						$error = true;
					} // if
				} // foreach

			} else {
				$username = format_input($_POST["username"]);

				// check if username contains valid characters
				if (!preg_match("/^[a-zA-Z0-9-.]*$/", $username)) {
					$userErr = "Letters, numbers, dashes and dots only, please.";
					$error = true;
				} // if
			} // else
			
			// validate password
			// check if password is submitted
			if (empty($_POST["password"])) {
				$pwdErr = "Password required.";
				$error = true;
			} else {
				$password = format_input($_POST["password"]);
			} // else

			// validate connection to MD
			// check if connection is submitted
			if (empty($_POST["connection"])) {
				$connErr = "Please select an option.";
				$error = true;
			} else {
				$connection = $_POST["connection"];

				// if user is not a student, remove grade from their data
				if ($_POST["connection"] == "student") {
					$grade = $_POST["grade"];
				} else {
					$_POST["grade"] = "NA";
				} // else
			} // else

			// validate user's agreement
			// check if agreement box is checked
			if (empty($_POST["agreement"])) {
				$agreeErr = "Please check.";
				$error = true;
			} else {
				$agreement = $_POST["agreement"];
			} // else
			
			$uid = file_get_contents("identifier.txt");

			// set variables for a default profile picture if the user doesn't have one
			if (empty($_FILES["image"]["name"])) {
				$imageFileType = "png"; // all default pfps are png files
				$targetFile = $targetDir . $uid . "." . $imageFileType;
				$isPfpUploaded = false;
			} else {
				$isPfpUploaded = true;
				// setting file-related variables if file is uploaded
				$targetFile = $targetDir . basename($_FILES["image"]["name"]);
				$imageFileType = strtolower(pathinfo($targetFile, PATHINFO_EXTENSION));
				
				// rename target file to uid
				$targetFile = $targetDir . $uid . "." . $imageFileType;

				// check if file is an image
				$check = exif_imagetype($_FILES["image"]["tmp_name"]);
				if (!($check !== false)) {
					$pfpErr = "File is not an image.";
					$error = true;
					
				// check if file already exists
				} else if (file_exists($targetFile)) {
					$pfpErr = "Image already exists.";
					$error = true;
					
				// check if file is too large
				} else if ($_FILES["image"]["size"] > 4000000) {
					$pfpErr = "Sorry, your file is too large. All files must be under 4MB.";
					$error = true;
					
				// check if file is a valid image type
				} else if ($imageFileType !== "jpg" && $imageFileType !== "png" && $imageFileType !== "jpeg") {
					$pfpErr = "Sorry, only .jpg, .jpeg, and .png files are allowed.";
					$error = true;
					
				} // else if
			} // else
		
		// if follow button is pressed
		} else if (isset($_POST["userToFollow"])) {
			follow($_POST["userToFollow"]);
		
		// if unfollow button is pressed
		} else if (isset($_POST["userToUnfollow"])) {
			unfollow($_POST["userToUnfollow"]);

		// if like button is pressed
		} else if (isset($_POST["postToLike"])){
			like($_POST["postToLike"]);

		// if unlike button is pressed
		} else if (isset($_POST["postToUnlike"])) {
			unlike($_POST["postToUnlike"]);
		} // else if

	} // if
	
	// display login or signup form if user is not logged in, store data if user signs up
	if (!isset($_SESSION["loggedIn"])) {
		
		// if user selects login or signup page, display page accordingly
		if (isset($_GET["page"])) {
			if ($_GET["page"] == "signup") {
				include "signupform.inc";
				echo "<script src='md5.js'></script>"; //XXX
			} else {
				include "loginform.inc";
			} // else

		// if signup form was submitted successfully
		} else if (isset($_POST["signup"]) && !$error) {

			// store formatted versions of each variable in post array
			$_POST["username"] = $username;
			$_POST["password"] = $password;
			$_POST["desc"] = $desc;
			$_POST["name"] = $name;
			$_POST["uid"] = $uid;
			$_POST["imagetype"] = $imageFileType;
			$_POST["following"] = array();
			$_POST["likedPosts"] = array();

			write_data_to_file($file);
			upload_pfp($targetDir, $targetFile, $isPfpUploaded);
			
			// creating user's .json file
			file_put_contents($uid . ".json", "");

			// store incremented uid in identifier text file
			file_put_contents("identifier.txt", ($uid + 1));
			
			// create profile image thumbnail
			if (!is_dir("pfpthumbs/")) {
				mkdir("pfpthumbs/", 0755);
			}
			$dest = "pfpthumbs/" . $uid . "." . $imageFileType;
			if (!file_exists($dest)) {
				createThumbnail($targetFile, $dest, 200, 200);
			}

			// provide user with login form after they've signed up
			include "loginform.inc";
		
		// if signup form was submitted unsuccessfully
		} else if ($error) {
			include "signupform.inc";
			echo "<script src='md5.js'></script>"; //XXX

		// if user is neither logging in or signing up
		} else {
			include "loginmenu.inc";
		} // else
	
	// if user is signed in
	} else {
		include "navmenu.inc";

		// if post form was submitted successfully
		if (isset($_POST["form"]) && !$error) {	
			
			// store formatted versions of each variable in post array
			$_POST["uid"] = $uid;
			$_POST["imagetype"] = $imageFileType;
			$_POST["desc"] = $desc;
			$_POST["likedBy"] = array();
			
			// convert tag string into array of tags (splitting around the commas)
			$tags = explode(",", $tagstring);
			foreach ($tags as &$tag) {
				$tag = format_input($tag);
				$tag = str_replace(" ", "", $tag);		
			} // foreach

			// remove duplicate tags
			$tags = array_unique($tags);
			
			// store tags array in post array
			$_POST["tags"] = $tags;

			write_data_to_file($_SESSION["userFile"]);
			upload_pfp($postDir, $targetFile, true);

			// put incremented post uid in post id text file
			file_put_contents("postid.txt", $uid + 1);

			// upload thumbnail for post
			if (!is_dir("thumbnails/")) {
				mkdir("thumbnails/", 0755);
			} // if
			$dest = "thumbnails/" . $uid . "." . $imageFileType;	
			if (!file_exists($dest)) {
				createThumbnail($targetFile, $dest, 200, 200);	
			} // if

			// show home page
			include "home.inc";
		
		// show post upload form if user wants to upload a post
		} else if ($error || (isset($_GET["page"]) && $_GET["page"] == "form")) {
			include "form.inc";

		// show home page in any other circumstance
		} else {
			include "home.inc";
		} // else
		
		// delete everything if user clicks delete button
		if (isset($_GET["action"]) && $_GET["action"] == "del") {
			if (file_exists($file)) {
				$jsonstring = file_get_contents($file);
				$userprofiles = json_decode($jsonstring, true);

				// delete all individual json files
				foreach ($userprofiles as $user) {
					$userFile = ($user["uid"] . ".json");
					if (file_exists($userFile)) {
						unlink($userFile);
					} // if
				} // foreach

				// delete profile json file
				unlink($file);
			} // if

			// delete post images
			if (is_dir($postDir)) {
				delete_images($postDir);
			} // if

			// delete profile images
			if (is_dir($targetDir)) {
				delete_images($targetDir);
			} // if

			// delete profile thumbnails
			if (is_dir("thumbnails/")) {
				delete_images("thumbnails/");
			} // if

			// delete post thumbnails
			if (is_dir("pfpthumbs/")) {
				delete_images("pfpthumbs/");
			} // if

			// reset identifier files
			file_put_contents("identifier.txt", 1);
			file_put_contents("postid.txt", 1);
			
		} // if

	// include logout button if user is logged in
	include "logout.inc";
	} // else
	
	include "footer.inc";

	// formats text (descriptions, usernames, names, etc.)
	function format_input($input) {
		$input = trim($input);
		$input = stripslashes($input);
		$input = htmlspecialchars($input);
		return $input;
	} // format_input
	
	// appends the contents of the post array to contents of the given json file
	// used for posting and profile creation
	function write_data_to_file($file) {
		if (file_exists($file)) {
			// get json string and decode into php array
			$jsonstring = file_get_contents($file);
			$userprofiles = json_decode($jsonstring, true);
		} // if
		
		// add form submission to data
		$userprofiles[] = $_POST;
		
		// encode php array to formatted json
		$jsoncode = json_encode($userprofiles, JSON_PRETTY_PRINT);
		
		// write json to file
		file_put_contents($file, $jsoncode);
	} // write_data_to_file

	// follow the given user (user given by uid)
	function follow($target) {
		$file = "userprofiles.json";

		// get json from file and decode into php array
		if(file_exists($file)){
			$jsonstring=file_get_contents($file);
			$userprofiles = json_decode($jsonstring, true);
		} // if
		
		// if target is not in user's following array, add target to user's following array
		if (!in_array($target, $userprofiles[$_SESSION["userUid"]-1]["following"])) {
			$userprofiles[$_SESSION["userUid"]-1]["following"][] = $target;			
		}

		//encode back into file
		$jsoncode = json_encode($userprofiles, JSON_PRETTY_PRINT);
		file_put_contents($file, $jsoncode);
		
	} // follow
	
	// unfollow the given user (user given by uid)
	function unfollow($target) {
		$file = "userprofiles.json";

		// get json file and decode into php array
		if(file_exists($file)){
			$jsonstring=file_get_contents($file);
			$userprofiles = json_decode($jsonstring, true);
		} // if

		// get array key of the person to unfollow
		$key = array_search($target, $userprofiles[$_SESSION["userUid"]-1]["following"]);

		// remove the person to unfollow from following array (using key) and store updated array (without keys)
		unset($userprofiles[$_SESSION["userUid"]-1]["following"][$key]);
		$userprofiles[$_SESSION["userUid"]-1]["following"] = array_values($userprofiles[$_SESSION["userUid"]-1]["following"]);

		//encode back into file
		$jsoncode = json_encode($userprofiles, JSON_PRETTY_PRINT);
		file_put_contents($file, $jsoncode);
	}

	// like the given post (post given by uid)
	function like($targetPost){
	
		$file = "userprofiles.json";
		
		// get json string and decode into php array
		if(file_exists($file)){
			$jsonstring = file_get_contents($file);
			$userprofiles = json_decode($jsonstring, true);
		} // if
	
		// check if targetpost is in array of liked posts
		if(!in_array($targetPost, $userprofiles[$_SESSION["userUid"]-1]["likedPosts"])){
			$userprofiles[$_SESSION["userUid"]-1]["likedPosts"][] = $targetPost; // update array of user's liked posts
		}
		
		// update array of post's liked by
		$x = 1; // counter

		// runs through all user's post jsons to find target post
		while(file_exists("$x.json")){

			// decode user's post json
			if(file_exists("$x.json")){
				$jsonstring = file_get_contents("$x.json");
				$userposts = json_decode($jsonstring, true);
			} // if
			if ($userposts != null) {
				
				// cycle through a user's posts, adds current user's uid to post's array of likers
				for($y = 0; $y < sizeof($userposts); $y ++){
					if($userposts[$y]["uid"] == $targetPost){
						if(!in_array($_SESSION["userUid"], $userposts[$y]["likedBy"])){
							$userposts[$y]["likedBy"][] = $_SESSION["userUid"];
						} // if
					} // if
				} // for loop
			} // if
			
			 
			//encode user's post json
			$jsoncode = json_encode($userposts, JSON_PRETTY_PRINT);
			file_put_contents("$x.json", $jsoncode);
			
			$x ++; // update counter

		} // while loop

		// encode user profiles into json
		$jsoncode = json_encode($userprofiles, JSON_PRETTY_PRINT);
		file_put_contents($file, $jsoncode);
		
	} // like
	
	// unlike the given post (post given by uid)
	function unlike($targetPost){
	
		$file = "userprofiles.json";
		
		//decode json string into php array
		if(file_exists($file)) {
			$jsonstring = file_get_contents($file);
			$userprofiles = json_decode($jsonstring, true);
		} // if
	
		// check if target post is in array of liked posts, remove target post
		if(($key = array_search($targetPost, $userprofiles[$_SESSION["userUid"] - 1]["likedPosts"])) !== false){
			unset($userprofiles[$_SESSION["userUid"] - 1]["likedPosts"][$key]);// update array of user's liked posts
		}

		// runs through all user's post jsons to find target post
		for ($x = 1; $x <= count($userprofiles); $x++){

			// decode user's post json
			if(file_exists("$x.json")){
				$jsonstring = file_get_contents("$x.json");
				$userposts = json_decode($jsonstring, true);
			} // if
			
			if ($userposts != null) {
				
				// cycle through a user's posts, remove user's uid from post's array of likers
				for($y = 0; $y < sizeof($userposts); $y ++){
					if($userposts[$y]["uid"] == $targetPost){
						if(($key = array_search($_SESSION["userUid"], $userposts[$y]["likedBy"])) !== false) {
							unset($userposts[$y]["likedBy"][$key]);
							$userposts[$y]["likedBy"] = array_values($userposts[$y]["likedBy"]);
						} // if
					} // if
				} // for loop
			} // if

			 
			//encode user's post json
			$jsoncode = json_encode($userposts, JSON_PRETTY_PRINT);
			file_put_contents("$x.json", $jsoncode);

		} // for loop
		

		// encode user profiles into json
		$jsoncode = json_encode($userprofiles, JSON_PRETTY_PRINT);
		file_put_contents($file, $jsoncode);
		
	} // unlike

	// upload image to a given directory
	function upload_pfp($targetDir, $targetFile, $isUploaded) {
		// if targetDir doesn't exist, create it
		if (!is_dir($targetDir)) {
			mkdir($targetDir, 0755);
		}
		
		// if image file was uploaded by the user (post or profile image)
		if ($isUploaded) {
			// upload the image file
			move_uploaded_file($_FILES["image"]["tmp_name"], $targetFile);

		// if image file was not uploaded by the user (user didn't upload profile image)
		} else {
			copy("images/" . rand(0, 4) . ".png", $targetFile);
		} // else
		
		// replace the uploaded files with resized ones, if needed..?
		createThumbnail($targetFile, $targetFile, 500, 500);
	} // upload_pfp ()
	
	// delete images from given directory
	function delete_images($dir) {
		if ($dh = opendir($dir)) {
			while (($tempfile = readdir($dh)) !== false) {
				if (!($tempfile === ".." || $tempfile === ".")) {
					unlink($dir . $tempfile);
				} // if
			} // while
			closedir($dh);
		} // if
	} // delete_images()
?>
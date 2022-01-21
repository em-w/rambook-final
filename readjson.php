<?php
session_start();

// reads json for user profile data and post data from json files and echoes it as json text

// read json file into array of strings
$jsonstring = file_get_contents("userprofiles.json");
 
// save the json data as a PHP array
$userarray = json_decode($jsonstring, true);

$userstring = ""; // string containing the contents of user's file (not in php array format)

$likedposts = $userarray[$_SESSION["userUid"] - 1]["likedPosts"];
 
$postsrequested = true; // boolean storing whether the 
 
 // use GET to determine type of access
if (isset($_GET["access"])){
	$access = $_GET["access"];
} else {
	$access = "all"; 
} // else

$returnData = [];
  
// pull all posts
if ($access != "all") { 
	if ($access == "self") {
		$userstring = file_get_contents($_SESSION["userUid"] . ".json");
		$userposts = json_decode($userstring, true);
		if ($userposts != null) {
			$returnData = $userposts;
		} // if
	} // if

	// pull all profiles
	else if ($access == "allpfs") {
		$postsrequested = false;
		foreach ($userarray as $user) {
			if ($user["uid"] == $_SESSION["userUid"]) {
				$user["current"] = true;
			} else {
				$user["current"] = false;
			} // else
			$returnData[] = $user;
		} // foreach
	} // else if

	// pull posts of people user is following
	else if ($access == "following") {
		$following = $userarray[$_SESSION["userUid"] - 1]["following"];
		if ($following != null) {
			foreach ($following as $userUid) {
				$userstring = file_get_contents($userUid . ".json");
				$userposts = json_decode($userstring, true);
				if ($userposts != null) {
					foreach ($userposts as $post) {
					$returnData[] = $post;
					} // foreach
				} // if
			} // foreach
		} // if
	} // else if
	  
	// pull posts of a selected profile
	else if (is_numeric($access)) {
		$userstring = file_get_contents($access . ".json");
		$userposts = json_decode($userstring);
		if ($userposts != null) {
			$returnData = $userposts;
		} // if
	
	} // else if

	// pull liked posts
    else if ($access == "liked") {
        foreach ($userarray as $user) {
           $userstring = file_get_contents($user["uid"] . ".json");
           $userposts = json_decode($userstring, true);
           if ($userposts != null) {
              foreach ($userposts as $post) {
					foreach ($likedposts as $likedpost) {
						if ($post["uid"] == $likedpost) {
							$returnData[] = $post;
						} // if
                    } // foreach
                } // foreach
            } // if
        } // foreach
    } // else if

	// pull list of profiles user is following
     else if ($access == "followingpfs") {
        $postsrequested = false;
        $userarray[$_SESSION["userUid"] - 1]["current"] = true;
        $returnData[] = $userarray[$_SESSION["userUid"] - 1];
        foreach ($userarray as $user) {
           foreach ($userarray[$_SESSION["userUid"] - 1]["following"] as $following) {
              if ($user["uid"] == $following) {
                 $returnData[] = $user;
              } // if
           } // foreach
        } // foreach
     } // else if

   // if access == all, pull list of all posts
  } else {
      foreach ($userarray as $user) {
         $userstring = file_get_contents($user["uid"] . ".json");
         $userposts = json_decode($userstring, true);
         if ($userposts != null) {
            foreach ($userposts as $post) {
               $returnData[] = $post;
            } // foreach
         } // if 
      } // foreach
  } // else


// if pulling posts, mark posts that have been liked by logged in user
if ($postsrequested) {
   foreach ($returnData as &$post) {
		if (in_array($_SESSION["userUid"], $post["likedBy"])) {
			$post["liked"] = true;
		} // if
		else {
			$post["liked"] = false;
		} // else
   } // foreach
} // if



// encode the php array to json 
 $jsoncode = json_encode($returnData, JSON_PRETTY_PRINT);
 echo ($jsoncode);



?>
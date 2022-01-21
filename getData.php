<?php
// Returns details for individual posts, based on the post's uid (provided through GET array)
// -- Returns post's author, description, and usernames of people who liked the post
	
$uid = $_GET["uid"];
$file = "userprofiles.json";	
$jsonstring = file_get_contents($file);	
$userprofiles = json_decode($jsonstring, true);	

foreach ($userprofiles as $user) {
	// open individual json file for each user (containing the user's posts)
	$userfile = $user["uid"] . ".json";
	$userstring = file_get_contents($userfile);
	$posts = json_decode($userstring, true);

	if ($posts != null) {
		// go through each user's post and find the post that matches the given uid
		foreach ($posts as $post) {
			if ($post["uid"] == $uid) {
				$post["author"] = $user["username"];
				foreach ($post["likedBy"] as &$liker) {
					$liker = $userprofiles[$liker - 1]["username"];
				} // foreach post[likedBy] as liker
				echo json_encode($post);
			} // if post[uid] == uid
		} // foreach posts as post
	} // if posts != null
	
} // foreach userprofiles as user
?>
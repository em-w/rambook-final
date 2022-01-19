<?php
	$uid = $_GET["uid"];

	$file = "userprofiles.json";
	
	$jsonstring = file_get_contents($file);
	
	$userprofiles = json_decode($jsonstring, true);
	
	foreach ($userprofiles as $user) {
		$userfile = $user["uid"] . ".json";
		$userstring = file_get_contents($userfile);
		$posts = json_decode($userstring, true);
		if ($posts != null) {
			foreach ($posts as $post) {
				if ($post["uid"] == $uid) {
					$post["author"] = $user["username"];
					echo json_encode($post);
				}
			}
		}
		
	}
?>
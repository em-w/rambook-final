<?php

 // read json file into array of strings
 $jsonstring = file_get_contents("userprofiles.json");
 
 // save the json data as a PHP array
 $phparray = json_decode($jsonstring, true);
 
 // use GET to determine type of access
 if (isset($_GET["term"])){
    $searchterms = explode("%", $_GET["term"]);
   } else {
    $searchterms = ""; 
   }
 
  $returnData = [];
  if ($searchterms != "") { 
    foreach($phparray as $entry) {
		$userfile = $entry["uid"] . ".json";
		$userstring = file_get_contents($userfile);
		$posts = json_decode($userstring, true);
		
		if(isset($posts)) {
			foreach ($posts as $post) {
				foreach($searchterms as $term) {
					if (in_array($term, $post["tags"])) {
						$returnData[] = $post;
						break;
					}
				} 
			
			}
		}	
        
    } // if 
  } else {
      // return an empty array?
     $returnData = array();
  }

// encode the php array to json 
 $jsoncode = json_encode($returnData, JSON_PRETTY_PRINT);
 echo ($jsoncode);



?>
<?php
session_start();

 // read json file into array of strings
 $jsonstring = file_get_contents("userprofiles.json");
 
 // save the json data as a PHP array
 $userarray = json_decode($jsonstring, true);

 $userstring = "";
 
 // use GET to determine type of access
 if (isset($_GET["access"])){
  $access = $_GET["access"];
 } else {
  $access = "all"; 
 }
 
  // pull student, alumnus or staff only or return all
  $returnData = [];
  if ($access != "all") { 
      if ($access == "self") {
         $userstring = file_get_contents($_SESSION["userUid"] . ".json");
         $userposts = json_decode($userstring);
         if ($userposts != null) {
            $returnData = $userposts;
         }
      }

      else if ($access == "allpfs") {
         foreach ($userarray as $user) {
            if ($user["uid"] == $_SESSION["userUid"]) {
               $user["current"] = true;
            } else {
				$user["current"] = false;
			}
            $returnData[] = $user;
         }
      }

      else if ($access == "following") {
         $following = $userarray[$_SESSION["userUid"] - 1]["following"];
         if ($following != null) {
               foreach ($following as $userUid) {
                  $userstring = file_get_contents($userUid . ".json");
                  $userposts = json_decode($userstring, true);
                  if ($userposts != null) {
                  foreach ($userposts as $post) {
                     $returnData[] = $post;
                  } 
               }
            }
        

         }
      }
	  
	  else if (is_numeric($access)) {
		 $userstring = file_get_contents($access . ".json");
         $userposts = json_decode($userstring);
         if ($userposts != null) {
            $returnData = $userposts;
         }
		
	  }

   /*foreach($phparray as $entry) {
      if ($entry["connection"] == $access) {
         $returnData[] = $entry;  
      }      
   } // foreach */

  } else {
      foreach ($userarray as $user) {
         $userstring = file_get_contents($user["uid"] . ".json");
         $userposts = json_decode($userstring, true);
         if ($userposts != null) {
            foreach ($userposts as $post) {
               $returnData[] = $post;
            } 
         }
      }
  }

// encode the php array to json 
 $jsoncode = json_encode($returnData, JSON_PRETTY_PRINT);
 echo ($jsoncode);



?>
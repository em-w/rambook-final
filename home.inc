<div id="viewmenu">
	<div onclick="loadImages('all', true)" class="viewbutton">show all posts</div>
	<div onclick="loadImages('following', true)" class="viewbutton">my feed</div>
	<div onclick="loadImages('self', true)" class="viewbutton">my posts</div>
	<div onclick="loadImages('allpfs', false)" class="viewbutton">show all profiles</div>
    <!-- <div onclick="loadImages('student')" class="viewbutton">show student profiles only</div> -->
    <!-- <div onclick="loadImages('alumnus')" class="viewbutton">show alumnus profiles only</div> -->
	<!-- <div onclick="loadImages('staff')" class="viewbutton">show staff profiles only</div> -->
</div>

<form id="searchbar">
	<input type="text" id="search">
	<input type=submit value="Search" class="button">
</form>


<?php
	$file = "userprofiles.json";
	$dir = "profileimages/";
	$thumbdir = "thumbnails/";
	
	echo "<div id='message'>";
	if (!file_exists($file)){
		echo "nothing to see here...yet....";
	}
	echo "</div>";
	
	echo "<div id='main'>";
	if (is_dir($thumbdir)) {
		if ($dh = opendir($thumbdir)) {
			while (($tempfile = readdir($dh)) !== false) {
				if (!($tempfile === ".." || $tempfile === ".")) {
					echo "<div class='card' onclick=\"displayLightBox('alt', '" . $tempfile . "')\"><img class ='thumb' src='" . $thumbdir . $tempfile . "'></div>";
				}
			}
			closedir($dh);
		}
	}
	echo "</div>";

	
?>

<div id="lightbox" class="hidden">	
	
</div>
	
<div id="positionBigImage">
	<img id="left" src="images/left.png" alt="left" onclick="goToNextImage(0)">
	<img id="right" src="images/right.png" alt="right" onclick="goToNextImage(1)">
	<img id="x" src="images/x.png" alt="close" onclick="displayLightBox('','')">
	<div id="boundaryBigImage" class="hidden">
        <img id="bigImage" src="images/arabian.jpg" alt="">
		<a id="download" href="images/arabian.jpg" download>Download image</a>
		<p id="text"></p>
	</div>	  
		  
</div>
	
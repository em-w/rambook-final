<div id="viewmenu">
	<div onclick="hideProfileBar(); loadImages('all', true);" class="viewbutton">show all posts</div>
	<div onclick="hideProfileBar(); loadImages('following', true);" class="viewbutton">my feed</div>
	<div onclick="showProfileInfo(<?php echo $_SESSION["userUid"]?>); loadImages('self', true)" class="viewbutton">my posts</div>
	<div onclick="hideProfileBar(); loadImages('liked', true);" class="viewbutton">liked posts</div>
	<div onclick="hideProfileBar(); loadImages('allpfs', false);" class="viewbutton">show all profiles</div>
	
</div>

<form id="searchbar">
	<input type="text" id="search">
	<input type=submit value="Search" class="button">
</form>

<div id="profileInfoBar">
	<h3 id="pUsername"></h3>
	<div>
		<img id="pImg" src="images/arabian.jpg" alt="placeholder">
	</div>
	<div>
		<p><strong>Name:</strong><p>
		<p id="pName"></p>
	</div>
		
	<div>
		<p><strong>About me:</strong><p>
		<p id="pDesc"></p>
		
	</div>
	
	<div>
		<p><strong>Connection to Mount Doug:</strong><p>
		<p id="pConnection"></p>
	</div>
	<br>
	
</div>

<div>
	<p><strong id="message"></strong><p>
</div>

<div id="main"></div>

<div id="lightbox">	
	
</div>
	
<div id="positionBigImage">
	<img id="left" src="images/left.png" alt="left" onclick="goToNextImage(0)">
	<img id="right" src="images/right.png" alt="right" onclick="goToNextImage(1)">
	<img id="x" src="images/x.png" alt="close" onclick="displayLightBox('','')">
	<div id="boundaryBigImage">
        <img id="bigImage" src="images/arabian.jpg" alt="">
		<a id="download" href="images/arabian.jpg" download>Download image</a>
		<p id="text"></p>
	</div>	  
		  
</div>
	
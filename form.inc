<h2>Make a post!</h2>
<p class="error">* Required</p>

<form method="POST" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>" enctype="multipart/form-data">
	<label for="image">Upload an image:</label>
	<input type="file" id="image" name="image" class="button" onchange="setSrc(500)"> <span class="error"> * <?php echo $pfpErr; ?></span> <br>
	<img id="imgSrc">
	<canvas id="preview" width="520" height="520"></canvas><br><br>
	
	<input type="checkbox" id="agreement" name="agreement" <?php if ($agreement != "") echo "checked"; ?>> 
	<label for="agreement">I give RamBook non-exclusive, transferable, sub-licensable, royalty-free, worldwide license to use this photo.</label>
	<span class = "error"> * <?php echo $agreeErr; ?> </span> <br><br>
	
	<label for="desc">Description:</label> <span class="error"> * <?php echo $descErr; ?></span> <br>
	<textarea id="desc" name="desc" rows="4" cols="50"><?php echo $desc; ?></textarea>
	<br>
	<br>
	
	<label for="tags">Tags (please separate all tags with commas!): </label> <span class="error"> <?php echo $tagsErr; ?></span> <br>
	<textarea id="tags" name="tags" rows="2" cols="50"><?php echo $tagstring; ?></textarea>
	<br>
	<br>
	<input type=submit value="Post!" name="form" class="button">
</form>

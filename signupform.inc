<a href="?page=login">Already have an account? Log in instead:D</a>
<p class="error">* Required</p>

<form method="POST" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>" enctype="multipart/form-data">
    <label for="username">Username:</label>
    <input type="text" id="username" name="username" value="<?php echo $username; ?>"> <span class="error"> * <?php echo $userErr; ?></span> <br><br>

    <label for="password">Password:</label>
    <input type="password" id="password" name="password""> <span class="error"> * <?php echo $pwdErr; ?></span> <br><br>

    <label for="name">Name:</label><br>
	<input type="text" id="name" name="name" value="<?php echo $name; ?>"> <span class = "error"> * <?php echo $nameErr; ?></span><br><br>	
   
	<label for="image">Profile Pic: </label>
	<input type="file" id="image" name="image" class="button" onchange="setSrc(200); showAgreement();"> <span class="error"> <?php echo $pfpErr; ?></span> <br>
	
    <div id="agreementDiv">
		<img id="imgSrc">
		<canvas id="preview" width="220" height="220"></canvas><br><br>
		<input type="checkbox" id="agreement" name="agreement" checked> 
		<label for="agreement">I give RamBook non-exclusive, transferable, sub-licensable, royalty-free, worldwide license to use this photo.</label>
		<span class = "error"> * <?php echo $agreeErr; ?> </span> <br><br>
	</div> <br>
	
    Connection to Mount Doug: <span class="error"> * <?php echo $connErr; ?></span> <br>
	<div id="fullConnMenu">
		<div id="connectionMenu" class="connMenuElement">
			<input type="radio" id="student" name="connection" value="Student" onclick="showGradeMenu()" 
			<?php if ($connection == "student") echo "checked"; ?>>
			<label for="student">Student</label> <br>
			
            <input type="radio" id="alumnus" name="connection" value="Alumnus" onclick="hideGradeMenu()" 
			<?php if ($connection == "alumnus") echo "checked"; ?>>
			<label for="alumnus">Alumnus</label> <br>
			
            <input type="radio" id="staff" name="connection" value="Staff" onclick="hideGradeMenu()" 
			<?php if ($connection == "staff") echo "checked"; ?>>
			<label for="staff">Staff</label> <br>
		</div>
		<br>
		<div id="gradeMenu" class="connMenuElement">
			<label for="grade">Current Grade:</label>
			<select name="grade" id="grade">
				<option value="9" <?php if($grade == 9) echo "selected"; ?>>9</option>
				<option value="10" <?php if($grade == 10) echo "selected"; ?>>10</option>
				<option value="11" <?php if($grade == 11) echo "selected"; ?>>11</option>
				<option value="12" <?php if($grade == 12) echo "selected"; ?>>12</option>
			</select>
			<br><br>
		</div>
		
	</div> <br><br><br><br>	
	<label for="desc">Say something about yourself:</label> <span class="error"> * <?php echo $descErr; ?></span> <br>
	<textarea id="desc" name="desc" rows="4" cols="50"><?php echo $desc; ?></textarea>
	<br>
	<br>
	<input type=submit value="Submit!" name="signup" class="button" id="signupSubmit" onclick="hash()">
</form>

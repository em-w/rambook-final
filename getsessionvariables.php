<?php
session_start();

if (isset($_GET["var"])) {
	if ($_GET["var"] == "uid") {
		echo $_SESSION["userUid"];
	}
}


?>
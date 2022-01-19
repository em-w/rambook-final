<?php

include "HZip.php";

// create a zip file of the images folder
$zipname = "profileimages.zip";
HZip::zipDir('profileimages', $zipname);

// Download the zipped file.
//  - If you get a zip file that does is corrupted, open
// it in a text editor. You may see the error messages
// it is getting.
header('Content-Type: application/zip');
header('Content-disposition: attachment; filename='.$zipname);
header('Content-Length: ' . filesize($zipname));
readfile($zipname);
unlink($zipname); // delete file off server
?>
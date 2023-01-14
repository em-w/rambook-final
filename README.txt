RAMBOOK
Authors : Emily, Hannah, Tommy.

createthumbnail.php            ----         Gets and crops image into a square, resizes the image, then saves it to the sever.
downloadall.php                ----         Calls HZip.php to zip profileimages directory then saves the zip file to the user's computer.
footer.inc                     ----         HTML for footer, also links the two javascript files.
form.inc                       ----         HTML Form for posting posts.
getData.php                    ----         Returns details for individual posts, based on the post's uid (provided through GET array).
header.inc                     ----         HTML for header, also links the CSS file.
home.inc                       ----         HTML for homepage (when logged in).
HZip.php                       ----         Gets files and folders from a directory and puts it into a Zip file.
identifier.txt                 ----         Stores the next user id.
index.php                      ----         Handles requests, page's functions.
loginform.inc                  ----         HTML form for logins.
loginmenu.inc                  ----         Contains two links for signup and login.
logout.inc                     ----         HTML form submit button for logging out.
md5.js                         ----         Javascript password hashing.
myscript.js                    ----         Javascript functions.
navmenu.inc                    ----         Navigation bar list of links.
postid.txt                     ----         Next posts id.
readjson.php                   ----         Reads and return user's profile json data.
searchprofiles.php             ----         Returns posts which matches the search term.
signupform.inc                 ----         HTML form for sign up.
style.css                      ----         Styles the page.
userprofiles.json              ----         Stores users' information such as usernames, hashed passwords, their description, etc.
(uid).json                     ----         Stores that uid's posts data (likes, images, description).	

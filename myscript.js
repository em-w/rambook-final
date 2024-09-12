//Variables
let size = 0; // size of preview
let previewImg = document.getElementById("imgSrc"); // image preview obj
let jsondata = []; // array of profiles currently being displayed on the screen
let currentUid = 0; // uid of profile currently displayed in lightbox

// shows grade dropdown menu
function showGradeMenu() {
	let x = document.getElementById("gradeMenu");
	x.style.display = "block";
} // showGradeMenu

// hides grade dropdown menu
function hideGradeMenu() {
	let x = document.getElementById("gradeMenu");
	x.style.display = "none";
} // hideGradeMenu

// show grade menu if student is selected in the connection to MD menu
function showChosenGrade() {
	let student = document.getElementById("student");
	if (student.checked) {
		showGradeMenu();
	} // if
} // showChosenGrade

// show agreement checkbox (or other elements in agreement div)
function showAgreement() {
	let x = document.getElementById("agreementDiv");
	x.style.display = "block";
	document.getElementById("agreement").checked = false;
} // showAgreement

window.onload = function() {
	showChosenGrade();
};

// hides profile info bar of user
function hideProfileBar() {
	document.getElementById("profileInfoBar").style.display = "none";
} // hideProfileBar


// initialize hidden elements of lightbox
window.onload = function (){
	document.getElementById("positionBigImage").style.display = "none";
	document.getElementById("lightbox").style.display = "none";
};

//On login/signup form submit hash the password
function hash() {
	document.getElementById("password").value = md5(document.getElementById("password").value);
} // hash

/*
*	Onchange of file input, get File obj of input, check if file type is supported, if yes
*	sets the size of preview, and set file as src of hidden image. If file type isn't 
*	supported show file type error message.
*
*	@param num stores the size of preview
*/
function setSrc (num) {
	const imgFile = document.getElementById("image").files;
	console.log(imgFile);
	const tError = document.getElementById("imgTypeErr");
	if (imgFile) {
		console.log(imgFile[0].type);
		if (imgFile[0].type == "image/png" || imgFile[0].type == "image/jpeg") {
			if (tError != null) {
				tError.style.display = "none";
			} // if
			size = num;
			previewImg.src = (URL.createObjectURL(imgFile[0]));
		}else {
			tError.style.display = "block";
			document.getElementById("agreementDiv").style.display = "none";
		} // else
	} // if
} // setSrc

// change the visibility of ID
function changeVisibility(divID) {
  	var element = document.getElementById(divID);
   	console.log(element.style.display);
  	if (element) {
		if (element.style.display = "none")
        element.style.display = "block";
	else 
		element.style.style.display = "none"";
  } // if
} // changeVisibility


// display lightbox with big image in it
function displayLightBox(alt, imageFile) {
  let boundaryImageDiv = document.getElementById("boundaryBigImage");
  let textDiv = document.getElementById("text");   
  let image = new Image();
  let bigImage = document.getElementById("bigImage");
  let download = document.getElementById("download");
  
  // get uid from image
  var requestedUid = imageFile.split(".")[0];

  // save uid into global variable
  currentUid = requestedUid;
  
  // get json data for uid
  if (imageFile != "") {
	  fetch ("./getData.php?uid=" + requestedUid)
	    .then(response => response.json())
		.then(data => updatePostContents(data))
		.catch(err => console.log("error occured" + err));
  } // if
  
  // update big image to access
  image.src = "postimages/" + imageFile;
  image.alt = alt;	
  
  // update download link
  download.href = image.src;
  
  // force big image to preload so we can have access 
  // to it's width so it will be centered in the page
  image.onload = function () { 
       var width = image.width; 
	   boundaryImageDiv.style.width = width + "px";  
  };
 
  bigImage.src = image.src;  // put big image in page
  textDiv.innerHTML = "<h4>" + alt + "</h4>";
  
  
  // show light box with big image
  changeVisibility('lightbox');
  changeVisibility('positionBigImage'); 
} // displayLightBox

// show the profile information of a given user in profile information bar
function showProfileInfo(user) {
	fetch("./readjson.php?access=allpfs")
		.then(response => response.json())
		.then(function(data) {
			console.log(data);

			// set information bar elements for various pieces of information
			let infoBar = document.getElementById("profileInfoBar");
			let username = document.getElementById("pUsername");
			let name = document.getElementById("pName");
			let desc = document.getElementById("pDesc");
			let connection = document.getElementById("pConnection");
			let profileImage = document.getElementById("pImg");
			
			
			let userInfo = data[user - 1];
			console.log(userInfo);
			
			// show user's profile image
			profileImage.src = "pfpthumbs/" + user + "." + userInfo.imagetype;
			
			// show info bar
			infoBar.style.display = "block";
			
			// set innerHTML of info bar elements with relevant info
			username.innerHTML = userInfo.username;
			name.innerHTML = userInfo.name;
			desc.innerHTML = userInfo.desc;
			let connectionString = userInfo.connection;
			if (connectionString == "student") {
				connectionString += ", in grade " + userInfo.grade;
			} // if
			connection.innerHTML = connectionString;
			
		}); // .then
	
} // showProfileInfo

// display post's author, description, tags and likes under big image in lightbox
function updatePostContents(data) {
	let taglinks = ""; // string of links for tags
	let likedBy = ""; // string of people who liked the post

	// generate links for tags from post's array of tags
	for (tag in data.tags) {
		if (data.tags[tag] != "") {
			taglinks += "<a href='hideProfileBar(); javascript:searchProfiles(\"" + data.tags[tag] + "\"); changeVisibility(\"lightbox\"); changeVisibility(\"positionBigImage\");'> #" + data.tags[tag] + "</a>&nbsp;&nbsp;&nbsp;&nbsp;"; 
		} // if
	} // for

	// create string displaying usernames of people who liked the post
	if (data.likedBy.length > 0) {
		likedBy = "Liked by: <br>";
		for (let i = 0; i < data.likedBy.length; i++) {
			likedBy += data.likedBy[i];
			if (i != (data.likedBy.length - 1)) {
				likedBy += ", "
			} // if
			if (i % 8 == 0 && i != 0) {
				console.log("i is " + i);
				likedBy += "<br>";
			} // if
		} // for

	} // for
	
	// put information into lightbox
	document.getElementById("text").innerHTML = "Posted by: " + data.author + "<br><br>" + data.desc + "<br><br>" + taglinks + "<br><br>" + likedBy;
}

// sorts list of profiles/posts by uid
function sortByUID() {
	return function(a, b) {
		if (a["uid"] > b["uid"]) {
			return 1;
		} else {
			return -1;
		} // else
	} // function
} //  sortByUid

// load requested subset of posts or profile images
function loadImages(access, isPost){
	let main = document.getElementById("main"); // div containing post/profile cards
	if (main) {	
		
		// get image source folder based on whether posts or profiles are being loaded
		if (isPost) {
			thumbFolder = "thumbnails/";
		} else {
			thumbFolder = "pfpthumbs/";
		} // else

		// get json string of posts or profiles
		fetch("./readjson.php?access=" + access).
		then(function(resp){ 
		return resp.json();
		})
		.then(function(data){ 
			let followingArray = []; // array of people the current user is following

			let i;  // counter     
			let j; // other counter
			// let main = document.getElementById("main"); // XXX
			let message = document.getElementById("message"); // text displayed on page (includes message for when no images loaded)
			message.innerHTML = ""; // clear contents of message
			let messageString = ""; // html to put inside of message

			// remove all existing children of main
			while (main.firstChild) {
				main.removeChild(main.firstChild);
			} // while

			// sort contents of data by uid
			if (data != null) {
				data.sort(sortByUID());

				// change message based on what is being loaded
				if (access == "all") {
					messageString = "All posts:";
				} else if (access == "self") {
					messageString = "My posts:";
				} else if (access == "following") {
					messageString = "My feed:";
				} else if (!isNaN(access)) {
					messageString = "Posts:";
				} else if (access == "allpfs") {
					messageString = "All profiles:";
				} else if (access == "liked") {
					messageString = "My liked posts:";
				} else if (access == "followingpfs") {
					messageString = "Following";
				} // else if

				// add to message if no posts/profiles are loaded
				if (data.length == 0 || (!isPost) && data.length == 1) {
					messageString += "<br> Looks like there's nothing here..."
				} // if
				
				// put message on the page
				message.innerHTML = messageString;

				// get list of people the user is following
				if (!isPost) {
					for (j in data) {
					console.log(data[j].current);
						if (data[j].current) {
							followingArray = data[j].following;
							data.splice(j, 1);

							break;
						} // if		
					} // for
				} // if

				// save data into global array
				jsondata = data;

				// for every image, create a new image object and add to main
				for (i in data){
					let img = new Image();
					let card = document.createElement('div');
					card.className = "card";
					console.log(data[i].uid + "." + data[i].imagetype);
					img.src = thumbFolder + data[i].uid + "." + data[i].imagetype;
					img.alt = data[i].uid;
					img.className = "thumb";
					main.appendChild(card).appendChild(img);
					
					// if card is a post, add like button (form) and like count
					if (isPost) {
						card.setAttribute("onclick", "displayLightBox('alt', '" + data[i].uid + "." + data[i].imagetype + "')");	
			
						let likeform = document.createElement('form');
						likeform.method = "post";
						likeform.setAttribute("onsubmit", "loadImages('" + access + "', '" + isPost + "')");
						let like = document.createElement('input');
						like.type = "image";
						let postToLike = document.createElement('input');

						if (data[i].liked == true) {
							like.src = "images/liked.png";
							like.alt = "liked button";
							postToLike.name = "postToUnlike";
						} else {
							like.src = "images/like.png";
							like.alt = "like button";
							postToLike.name = "postToLike";
							
						} // else
						
						like.className = "like";
						postToLike.type = "hidden";
						
						postToLike.value = data[i].uid;
						card.appendChild(likeform).appendChild(like);
						likeform.appendChild(postToLike);

						let likeCount = document.createElement('p');
						let count = Object.keys(data[i].likedBy).length;
						let likeCountText = document.createTextNode(count + " like" + (count == 1 ? "" : "s"));
						card.appendChild(likeCount.appendChild(likeCountText));
					
					// if card is a profile, add follow button (form) and link to profile
					} else {
						let followform = document.createElement('form');
						followform.method = "post";
						followform.setAttribute("onsubmit", "loadImages('" + access + "', '" + isPost + "')");
						let follow = document.createElement('input');
						follow.type = "image";
						follow.className = "follow";
						let userToFollow = document.createElement('input');
						userToFollow.type = "hidden";
						userToFollow.value = data[i].uid;
						card.appendChild(followform).appendChild(follow);
						followform.appendChild(userToFollow);
						
						if (followingArray.includes(data[i].uid)) {
							follow.src = "images/unfollow.png";
							follow.alt = "unfollow button";
							userToFollow.name = "userToUnfollow";
						} else {
							follow.src = "images/follow.png";
							follow.alt = "follow button";
							userToFollow.name = "userToFollow";
						} // else
						
						let username = document.createElement('a');
						let usernameText = document.createTextNode(data[i].username);
						username.href = "javascript:showProfileInfo(" + data[i].uid + "); loadImages(" + data[i].uid + ", true);"; 
						username.appendChild(usernameText);
						
						card.appendChild(username);
					}//if(!isPost)
				}//for
			}// if data != null
		});//fetch then
	} // if main exists
} // loadImages

// by default, load all images
window.onload = function() {
	loadImages("all", true);
} // window.onload

// display the next image (of images currently displayed) in the lightbox
function goToNextImage(direction) {
	
	let current; // index of current image being displayed (changes)
	let i; // counter
	
	// get index of current image
	for (i in jsondata) {
		if (jsondata[i].uid == currentUid) {
			current = i;
			break;
		} // if
	} // for
	
	// change big image to next image:
	// do logic based on direction - 1 means right, 0 means left
	if (direction == 1) {
		current++;
		if (current < jsondata.length) {
			displayLightBox('','');
			displayLightBox('alt', jsondata[current].uid + "." + jsondata[current].imagetype);
			currentUid = jsondata[current].uid;
		} // if
	} else {
		current--;
		if (current > -1) {
			displayLightBox('','');
			displayLightBox('alt', jsondata[current].uid + "." + jsondata[current].imagetype);
			currentUid = jsondata[current].uid;
		} // if
	} // else
} // goToNextImage

const searchbar = document.getElementById("searchbar"); // search bar

if (searchbar != null) {
	// when search is submitted, execute code to search profiles
	searchbar.addEventListener('submit', event => {
		event.preventDefault();
		searchProfiles(document.getElementById("search").value);
	})
} // if


// searches profiles based on terms in a string
function searchProfiles(term) {

	// convert terms string into a string that can be passed into a url (add %s where there would be spaces)
	term = term.trim();
	const termsArray = term.split(" ");
	let termsUrl = "";
	for (let i = 0; i < termsArray.length; i++) {
		termsUrl += termsArray[i];
		if ((i + 1) != termsArray.length) {	
			termsUrl += "%";
		} // if
	} // for

	fetch("./searchprofiles.php?term=" + termsUrl).
    then(function(resp){ 
      return resp.json();
    })
    .then(function(data){
      console.log(data); 
	  
      let i;  // counter     
      let main = document.getElementById("main");
	  let message = document.getElementById("message");
	  
      
      // remove all existing children of main
	  if (main.firstChild != null) {
		  while (main.firstChild) {
			main.removeChild(main.firstChild);
		  }
	  }
	 
	  // sort contents of data by uid
	  data.sort(sortByUID());
	 
	  // save data into global array
	  jsondata = data;
	  
	  // if profiles are returned from the search, display them 
	  // otherwise, display message saying that no results were returned
	  if (data.length != 0) {
		message.innerHTML = "Search results:";
		for (i in data){
			let img = new Image();
			let card = document.createElement('div');
			card.className = "card";
			card.setAttribute("onclick", "displayLightBox('alt', '" + data[i].uid + "." + data[i].imagetype + "')");	
			console.log(data[i].uid + "." + data[i].imagetype);
			img.src = "thumbnails/" + data[i].uid + "." + data[i].imagetype;
			img.alt = data[i].desc;
			img.className = "thumb";
			main.appendChild(card).appendChild(img);
		}
	  } else {
		message.innerHTML = "Sorry, doesn't ring a bell. (Your search returned no results.)";
	  } // else
      // for every image, create a new image object and add to main
      
    }); // .then

} // searchProfiles

//	Onload of hidden image source, crop image set it as preview canvas source then resize
if (previewImg) {
		previewImg.onload = function () {
		//Getting the area of the crop
		let width = previewImg.width; // width of image
		let height = previewImg.height; // height of image
		let ratio = (previewImg.width / previewImg.height);  // width height ratio of image
		let startX = 0;	//starting X point for cropping image
		let startY = 0;	//starting Y point for cropping image
		
		if (ratio >= 1) {
			//if image is wider than tall then cut X
			let thumbRatio = previewImg.height / size;
			startX = (previewImg.width - (thumbRatio * size)) / 2;
			width = (thumbRatio * size);
		}else {
			//if image is taller than wide cut Y
			let thumbRatio = previewImg.width / size;
			startY = (previewImg.height - (thumbRatio * size)) / 2;
			height = (thumbRatio * size);
		}//if else
			
		//crop image and sets it to preview canvas
		document.getElementById("preview").getContext("2d").drawImage(previewImg, startX, startY, width, height, 10, 10, size, size);
	}// function
}//if

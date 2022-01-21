//Variables
let size = 0; // size of preview
let previewImg = document.getElementById("imgSrc"); // image preview obj
let jsondata = []; // array of profiles currently being displayed on the screen
let currentUid = 0; // uid of profile currently displayed in lightbox
let gAccess = "";
let gIsPost = "";

function showGradeMenu() {
	let x = document.getElementById("gradeMenu");
	x.style.display = "block";
}

function hideGradeMenu() {
	let x = document.getElementById("gradeMenu");
	x.style.display = "none";
}

function showChosenGrade() {
	let student = document.getElementById("student");
	if (student.checked) {
		showGradeMenu();
	}
}

function showAgreement() {
	let x = document.getElementById("agreementDiv");
	x.style.display = "block";
	document.getElementById("agreement").checked = false;
}

window.onload = function() {
	showChosenGrade();
};

function hideProfileBar() {
	document.getElementById("profileInfoBar").style.display = "none";
}


// initialize hidden elements of lightbox
window.onload = function (){
	document.getElementById("positionBigImage").style.display = "none";
	document.getElementById("lightbox").style.display = "none";
};

//onchange hash
function hash() {
	document.getElementById("password").value = md5(document.getElementById("password").value);
}

//Onchange of upload, get DOMSTRING and set src of hidden img
//num is the width and height of the preview
function setSrc (num) {
	const imgFile = document.getElementById("image").files;
	console.log(imgFile);
	const tError = document.getElementById("imgTypeErr");
	if (imgFile) {
		console.log(imgFile[0].type);
		if (imgFile[0].type == "image/png" || imgFile[0].type == "image/jpeg") {
			if (tError != null) {
				tError.style.display = "none";
			}
			size = num;
			previewImg.src = (URL.createObjectURL(imgFile[0]));
		}else {
			tError.style.display = "block";
			document.getElementById("agreementDiv").style.display = "none";
		}
	}
}

// change the visibility of ID
function changeVisibility(divID) {
  var element = document.getElementById(divID);
   console.log(element.style.display);
  if (element) {
	if (element.style.display == "none")
        element.style.display = "block";
	else 
		element.style.display = "none";
  }
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
  }
  
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
}

function showProfileInfo(user) {
	fetch("./readjson.php?access=allpfs")
		.then(response => response.json())
		.then(function(data) {
			console.log(data);
			let infoBar = document.getElementById("profileInfoBar");
			let username = document.getElementById("pUsername");
			let name = document.getElementById("pName");
			let desc = document.getElementById("pDesc");
			let connection = document.getElementById("pConnection");
			let profileImage = document.getElementById("pImg");
			
			
			let userInfo = data[user - 1];
			console.log(userInfo);
			
			profileImage.src = "pfpthumbs/" + user + "." + userInfo.imagetype;
			
			infoBar.style.display = "block";
			
			
			username.innerHTML = userInfo.username;
			name.innerHTML = userInfo.name;
			desc.innerHTML = userInfo.desc;
			
			let connectionString = userInfo.connection;
			if (connectionString == "student") {
				connectionString += ", in grade " + userInfo.grade;
			}
			
			connection.innerHTML = connectionString;
			
		});
	
}

// display user's name, grade, description, ect. under big image in lightbox
function updatePostContents(data) {
	console.log(data);
	
	let taglinks = "";
	let likedBy = "";
	
	for (tag in data.tags) {
		taglinks += "<a href='hideProfileBar(); javascript:searchProfiles(\"" + data.tags[tag] + "\"); changeVisibility(\"lightbox\"); changeVisibility(\"positionBigImage\");'> #" + data.tags[tag] + "</a>&nbsp;&nbsp;&nbsp;&nbsp;"; 
	}

	for (let i = 0; i < data.likedBy.length; i++) {
		likedBy += data.likedBy[i];
		if (i != (data.likedBy.length - 1)) {
			likedBy += ", "
		}
		if (i % 8 == 0 && i != 0) {
			console.log("i is " + i);
			likedBy += "<br>";
		}
	}
	
	document.getElementById("text").innerHTML = "Posted by: " + data.author + "<br><br>" + data.desc + "<br><br>" + taglinks + "<br><br>Liked by:<br>" + likedBy;
}



// sorts list of profiles by uid
function sortByUID() {
	return function(a, b) {
		if (a["uid"] > b["uid"]) {
			return 1;
		} else {
			return -1;
		}
	}
}

// load all posts or users's posts only
function loadImages(access, isPost){
	let main = document.getElementById("main");
	if (main) {
	
	console.log(isPost);
	console.log(access);
	gAccess = access;
	gIsPost = isPost;
	
	if (isPost) {
		thumbFolder = "thumbnails/";
		
	} else {
		thumbFolder = "pfpthumbs/";
	}
	fetch("./readjson.php?access=" + access).
    then(function(resp){ 
      return resp.json();
    })
    .then(function(data){
		console.log(data); 
		let followingArray = [];

		// everything beyond this point can be turned into a method probably
		let i;  // counter     
		let j; // other counter
		let main = document.getElementById("main");
		let message = document.getElementById("message");
		message.innerHTML = "";
		let messageString = "";
		// remove all existing children of main
		while (main.firstChild) {
		main.removeChild(main.firstChild);
		}

		// sort contents of data by uid
		if (data != null) {
		data.sort(sortByUID());

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
		}

		if (data.length == 0 || (!isPost) && data.length == 1) {
			messageString += "<br> Looks like there's nothing here..."
		}

		message.innerHTML = messageString;



			//get following list
			if (!isPost) {
				for (j in data) { // fix me :(
				console.log(data[j].current);
					if (data[j].current) {
						followingArray = data[j].following;
						console.log(followingArray); // come back
						data.splice(j, 1);

						break;
					}				
				}
			}
			console.log(followingArray); // come back

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
						
					}
					
					like.className = "like";
					postToLike.type = "hidden";
					
					postToLike.value = data[i].uid;
					card.appendChild(likeform).appendChild(like);
					likeform.appendChild(postToLike);

					let likeCount = document.createElement('p');
					let count = Object.keys(data[i].likedBy).length;
					let likeCountText = document.createTextNode(count + " like" + (count == 1 ? "" : "s"));
					card.appendChild(likeCount.appendChild(likeCountText));
					

					
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

					}
					else {
						follow.src = "images/follow.png";
						follow.alt = "follow button";
						userToFollow.name = "userToFollow";

					}
					
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

window.onload = function() {
	loadImages("all", true);
}

// return the provided session variable FIX ME
function getSessionVariable(variable) {
	fetch("./getsessionvariables.php?var=" + variable).
    then(function(resp){
        return resp.json;
    }).
	then(function(data) {
		console.log(data);
		console.log("sdhfjkdskf");
		return data;	});
}

// display the next image (of images currently displayed) in the lightbox
function goToNextImage(direction) {
	
	let current; // index of current image being displayed (changes)
	let i; // counter
	
	for (i in jsondata) {
		if (jsondata[i].uid == currentUid) {
			current = i;
			break;
		}
	}
	
	// logic based on direction - 1 means right, 0 means left
	if (direction == 1) {
		current++;
		if (current < jsondata.length) {
			displayLightBox('','');
			displayLightBox('alt', jsondata[current].uid + "." + jsondata[current].imagetype);
			currentUid = jsondata[current].uid;
		} 
	} else {
		current--;
		if (current > -1) {
			displayLightBox('','');
			displayLightBox('alt', jsondata[current].uid + "." + jsondata[current].imagetype);
			currentUid = jsondata[current].uid;
		}
	}
}


const searchbar = document.getElementById("searchbar");

if (searchbar != null) {
	// when search is submitted, execute code to search profiles
	searchbar.addEventListener('submit', event => {
		event.preventDefault();
		searchProfiles(document.getElementById("search").value);
	})
} // if


// searches profiles based on terms in a string
function searchProfiles(term) {
	
	// convert terms string into a string that can be passed into a url
	// note: should add more validation
	const termsArray = term.split(" ");
	let termsUrl = "";
	for (let i = 0; i < termsArray.length; i++) {
		termsUrl += termsArray[i];
		if ((i + 1) != termsArray.length) {	
			termsUrl += "%";
		}
	}

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
		  message.innerHTML = "Sorry, doesn't ring a bell. (Your search returned no results.)"
	  }
      // for every image, create a new image object and add to main
      
    });

}

//onload of image preview crop and resize it
previewImg.onload = function () {
	console.log(size);
	//Getting the area of the crop
	let width = previewImg.width;
	let height = previewImg.height;
	let ratio = (previewImg.width / previewImg.height);
	let startX = 0;
	let startY = 0;
	
	if (ratio >= 1) {
		let thumbRatio = previewImg.height / size;
		startX = (previewImg.width - (thumbRatio * size)) / 2;
		width = (thumbRatio * size);
		console.log("x" + startX);
	}else {
		let thumbRatio = previewImg.width / size;
		startY = (previewImg.height - (thumbRatio * size)) / 2;
		height = (thumbRatio * size);
		console.log("y" + startY);
	}
	document.getElementById("preview").getContext("2d").drawImage(previewImg, startX, startY, width, height, 10, 10, size, size);
	console.log(previewImg + " " + startX + " " + startY + " " + width + " " + height  + " " + size);
}

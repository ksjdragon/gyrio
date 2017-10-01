function randInt(min,max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function hexToRGB(hex) {
    var r = parseInt(hex.slice(0, 2), 16),
        g = parseInt(hex.slice(2, 4), 16),
        b = parseInt(hex.slice(4, 6), 16);

    return [r,g,b];
}

function  convertData(text, base){
	if(text.length < 150) {
		website = "";
		return;
	}
	var output = "";
	for (var i = 0; i < text.length; i++)
	{
		var letter = text[i].charCodeAt(0).toString(base);
		output += letter;
	}
	return output;
}

function generateString() {
	var final = "";
	var length = randInt(50,100);
	for(var i = 0; i < length; i++) {
		final += randInt(0,1);
	}
	return final;
}

var canvas = document.getElementById("canvas");
var visualCtx = canvas.getContext("2d");


var audioCtx = new window.AudioContext();
var doAnimate = true;
var freq = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25];

canvas.width = window.innerWidth;
canvas.height =  window.innerHeight;

visualCtx.fillStyle = "#000";
visualCtx.fillRect(0,0, canvas.width, canvas.height);
function generateFrames(frame, string, width, height, rate) {
	// Rate is in bits per second
	// 30 frames per second
	var bitsPerSection = Math.ceil(canvas.width/width)+2;
	var shift = canvas.width-rate*width*frame/30;
	var bitsToCalc = Math.ceil(rate*width*frame/(width*30));
	var output = [];
	for(var i = bitsToCalc-bitsPerSection; i < bitsToCalc; i++) {
		try {
			var x = i*width;
			if(parseInt(string[i])) {
				output.push([x+shift, -height+canvas.height/2]);
				output.push([x+width+shift, -height+canvas.height/2]);
				if(string[i-1] === 0) {
					output.push([x+width+shift, canvas.height/2]);
				}
			} else {
				output.push([x+shift, canvas.height/2]);
				output.push([x+width+shift,canvas.height/2]);
			}
		} catch(err) {}
	}
	return output;
}

function drawFrame(frame ,input) {
	visualCtx.fillRect(0,0, canvas.width, canvas.height);
	visualCtx.beginPath();
	var frame1 = generateFrames(frame, input, 100, 100, speed);
	visualCtx.moveTo(0,(canvas.height/2)-100);
	for(var i = 1; i < frame1.length; i++) {
		visualCtx.lineTo(frame1[i][0],frame1[i][1]);
	}
	visualCtx.strokeStyle="#006064";
	visualCtx.stroke();
}

function drawFrame2(frame ,input) {
	visualCtx.fillRect(0,0, canvas.width, canvas.height);
	var ColorList = ["006064"/*,"00838F","0097A7","00ACC1","00B8D4","00E5FF","18FFFF","84FFFF"*/];

	for(var j=0;j<ColorList.length;j++){
		visualCtx.beginPath();
		var frame1 = generateFrames(frame, input, 100, 100, 5);
		console.log(frame1);
		//frame1= rotate(frame1,30);
		var xStart = canvas.width/2;
		var yStart = 10*j + canvas.height/2;
		var hMM = [xStart*Math.cos(toRad(30))-yStart*Math.sin(toRad(30)),xStart*Math.sin(toRad(30))+yStart*Math.cos(toRad(30))];
		visualCtx.moveTo(0,(canvas.height/2)-100);
		for(var i = 1; i < frame1.length; i++) {
			visualCtx.lineTo(frame1[i][0], /*0.05*(j+1)*(*/frame1[i][1]-canvas.height/2/*-canvas.height/2)+canvas.height/2*/);
		}
		visualCtx.strokeStyle="#"+ ColorList[j];
		visualCtx.stroke();
	}
}

function toRad(theta){
	return theta*(Math.PI/180);
}

function rotate(list,theta){
	var output = [];
	for(var i=0;i < list.length;i++){
		output.push([list[i][0]*Math.cos(toRad(theta))-list[i][1]*Math.sin(toRad(theta)),list[i][0]*Math.sin(toRad(theta))+list[i][1]*Math.cos(toRad(theta))]);
	}
	return output;
}

function getWebsite(url) {
	var proxy = "https://cors-anywhere.herokuapp.com/";
    var xhr = new XMLHttpRequest();
    xhr.open("GET", proxy+url, false);
    xhr.onreadystatechange = function() {
    	if(xhr.readyState === 4) {
    		if(xhr.status === 200) {
    		} else {
    			document.getElementById("urlInput").value = "";
				alert("Invalid URL!");
				
    		}
    	}
    }
	xhr.send();
	return xhr.responseText;
}

function animate(n , input) {
	if(!doAnimate) return;
	drawFrame(n, input);
	setTimeout(function() { animate(n+1, input); }, 100/3);
}

var type = "LO";
var speed = 5;
var doAnimate = true;
var doSound = false;
var website = "";
var visualCtx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height =  window.innerHeight;

visualCtx.fillStyle = "#1a1a1a";
visualCtx.fillRect(0,0, canvas.width, canvas.height);


var osc;
function sound(n, input) {
	if(!doSound) {
		document.getElementById("DAText").innerHTML = "";
		osc.stop();
		return;
	}
	if(n === 0) {
		osc = audioCtx.createOscillator();
		osc.connect(audioCtx.destination);
		osc.start(0);
      	osc.type = "sawtooth";
      	// osc.frequency.value = 261.63;
      	temp = [];
	}
    // var max = 523.25;
    // var min = 130.81;
    document.getElementById("DAText").innerHTML = input[n];
	osc.frequency.value = freq[input[n]];
    // osc.frequency.value = parseInt(input.substr(n, 10), 2);
    // var rand = randInt(130, 523);
    // var direction = 1;
    // if (rand < osc.frequency.value) {direction = -1;}
    // osc.frequency.value += direction * input[n] * 10;
	setTimeout(function() { sound(n+1, input); }, 10*speed);
}


function image(input) {
	try {
		document.getElementById("imagecode").parentNode.removeChild(document.getElementById("imagecode"));
	} catch(err) {}
    n = 0;
    imagecan = document.createElement('canvas');
    imagecan.width = Math.floor(Math.sqrt(input.length/6));
    imagecan.height = imagecan.width;
    imagecan.id = "imagecode";
    document.body.appendChild(imagecan);
    var ctx = imagecan.getContext("2d");

    var imageData = ctx.getImageData(0,0,imagecan.width, imagecan.height);

    for(var i = 0; i < imageData.data.length; i++) {
        fill = hexToRGB(input.substr(n,6));
        imageData.data[4*i] = fill[0];
        imageData.data[4*i+1] = fill[1];
        imageData.data[4*i+2] = fill[2];
        imageData.data[4*i+3] = 255;
        n += 6;
    }
    // fakeimage = document.createElement('canvas');
    // fakeimage.width = imagecan.width;
    // fakeimage.height = imagecan.height;
    // fakeimage.getContext("2d").putImageData(imageData, 0, 0);
    // ctx.canvas.width = 480;
    // ctx.canvas.height = 480;
    // ctx.scale(imagecan.width * (480/imagecan.width), imagecan.height *(480/imagecan.height));
    // ctx.drawImage(fakeimage, 0, 0);
    // console.log(fakeimage, ctx)
    ctx.putImageData(imageData, 0, 0);
}

function search() {
	var input = document.getElementById("urlInput");
	var value = input.value;
	if(value === "" || value === website && type !== "IV") return;
	website = value;
	visualCtx.fillStyle = "#1a1a1a";
	visualCtx.fillRect(0,0, canvas.width, canvas.height);
	try {
		document.getElementById("imagecode").parentNode.removeChild(document.getElementById("imagecode"));
	} catch(err) {}
	switch(type) {
		case "LO":
			var data = convertData(getWebsite(website),2);
			doSound = false;
			doAnimate = false;
			setTimeout(function() {
				speed = 5;
				doAnimate = true;
				document.getElementById("speedInput").value = 5;
				animate(0, data); 
			}, 100/3);
			break;
		case "DA":
			var data = convertData(getWebsite(website),8);
			doAnimate = false;
			doSound = false;
			setTimeout(function() {
				speed = 50;
				doSound = true;
				document.getElementById("speedInput").value = 50;
				sound(0, data); 
			}, 100/3);
			break;
		case "IV":
			var data = convertData(getWebsite(website),16);
			doAnimate = false;
			doSound = false;
			setTimeout(function() {
				image(data); 
			}, 100/3);
			break;
	}
}

document.getElementsByClassName("fa-search")[0].onclick = function() {
	search();
}

document.getElementById("urlInput").onkeypress = function(e) {
    if(e.keyCode == 13) {
        search();
    }
}


document.getElementsByClassName("fa-cog")[0].onclick = function() {
	document.getElementById("speedContainer").classList.toggle("show");
}

document.getElementsByClassName("fa-bars")[0].onclick = function() {
	document.getElementById("modeContainer").classList.toggle("show");
}

window.onclick = function(event) {
  if (!event.target.matches(".dropButton")) {

    var dropdowns = document.getElementsByClassName("dropdown-content");
    for (var i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

document.getElementById("speedInput").onchange = function() {
	speed = parseInt(this.value);
}

document.getElementById("LO").onclick = function() {
	if(type === "LO") return;
	if(website === "") {
		alert("Please enter a website!");
		return;
	}
	type = "LO";
	try {
		document.getElementById("imagecode").parentNode.removeChild(document.getElementById("imagecode"));
	} catch(err) {}
	var data = convertData(getWebsite(website),2);
	visualCtx.fillStyle = "#1a1a1a";
	visualCtx.fillRect(0,0, canvas.width, canvas.height);
	doSound = false;
	doAnimate = false;
	setTimeout(function() {
		speed = 5;
		doAnimate = true;
		document.getElementById("speedInput").value = 5;
		animate(0, data); 
	}, 100/3);
}

document.getElementById("DA").onclick = function() {
	if(type === "DA") return;
	if(website === "") {
		alert("Please enter a website!");
		return;
	}
	type = "DA";
	try {
		document.getElementById("imagecode").parentNode.removeChild(document.getElementById("imagecode"));
	} catch(err) {}
	var data = convertData(getWebsite(website),8);
	visualCtx.fillStyle = "#1a1a1a";
	visualCtx.fillRect(0,0, canvas.width, canvas.height);
	doAnimate = false;
	doSound = false;
	setTimeout(function() {
		speed = 50;
		doSound = true;
		document.getElementById("speedInput").value = 50;
		sound(0, data); 
	}, 100/3);
}

document.getElementById("IV").onclick = function() {
	if(type === "IV") return;
	if(website === "") {
		alert("Please enter a website!");
		return;
	}
	type = "IV";
	var data = convertData(getWebsite(website),16);
	visualCtx.fillStyle = "#1a1a1a";
	visualCtx.fillRect(0,0, canvas.width, canvas.height);
	doAnimate = false;
	doSound = false;
	setTimeout(function() {
		image(data); 
	}, 100/3);
}

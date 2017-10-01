var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height =  window.innerHeight;

var frames = [];

function randInt(min,max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function toBinary(text){
	var output = "";
	for (var i = 0; i < text.length; i++)
	{
		var letter = text[i].charCodeAt(0).toString(2);
		output += "0".repeat(8-letter.length) + letter;
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

function generateFrames(frame, string, width, height, rate) {
	// Rate is in bits per second
	// 30 frames per second
	var bitsPerSection = Math.ceil(canvas.width/width);
	var shift = canvas.width-rate*width*frame/30;
	var bitsToCalc = Math.ceil(rate*width*frame/(width*30));
	var output = [];
	console.log(shift);
	console.log(bitsToCalc);
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

var string = toBinary(getWebsite("https://www.google.com"));

function drawFrame(frame) {
	ctx.fillRect(0,0, canvas.width, canvas.height);
	ctx.beginPath();
	var frame = generateFrames(frame, string, 100, 100, 10000000000000);
	console.log(frame);
	ctx.moveTo(0, canvas.height/2);
	for(var i = 0; i < frame.length; i++) {
		ctx.lineTo(frame[i][0], frame[i][1]);
	}
	ctx.strokeStyle="#4CAF50";
	ctx.stroke();
}

function getWebsite(url) {
	var proxy = "https://cors-anywhere.herokuapp.com/";
    var xhr = new XMLHttpRequest();
    xhr.open("GET", proxy+url, false);
    xhr.send();
    return xhr.responseText;
}

function animate(n) {
	if(!doAnimate) return;
	drawFrame(n);
	setTimeout(function() { animate(n+1) }, 100/3);
}

ctx.fillStyle = "#000";
ctx.fillRect(0,0, canvas.width, canvas.height);

var doAnimate = true;

animate(0);



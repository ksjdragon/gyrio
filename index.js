function randInt(min,max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function  convertData(text, base){
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

function generateFrames(frame, string, width, height, rate) {
	// Rate is in bits per second
	// 30 frames per second
	var bitsPerSection = Math.ceil(canvas.width/width);
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
	var frame = generateFrames(frame, input, 100, 100, 100);
	visualCtx.moveTo(0, canvas.height/2);
	for(var i = 0; i < frame.length; i++) {
		visualCtx.lineTo(frame[i][0], frame[i][1]);
	}
	visualCtx.strokeStyle="#4CAF50";
	visualCtx.stroke();
}

function getWebsite(url) {
	var proxy = "https://cors-anywhere.herokuapp.com/";
    var xhr = new XMLHttpRequest();
    xhr.open("GET", proxy+url, false);
    xhr.send();
    return xhr.responseText;
}

function animate(n , input) {
	if(!doAnimate) return;
	drawFrame(n, input);
	setTimeout(function() { animate(n+1, input) }, 100/3);
}

function sound(n, input) {
	if(n === 0) {
		osc.connect(audioCtx.destination);
		osc2.connect(audioCtx.destination);
		osc3.connect(audioCtx.destination);
		osc.start(0);
	}
	osc.frequency.value = freq[input[n]];
	setTimeout(function() { sound(n+1, input); }, 500); 
}

var canvas = document.getElementById("canvas");
var visualCtx = canvas.getContext("2d");
var audioCtx = new window.AudioContext();
var osc = audioCtx.createOscillator();
var doAnimate = true;
var freq = [440, 494, 523, 587, 660, 698, 784, 880];

canvas.width = window.innerWidth;
canvas.height =  window.innerHeight;

visualCtx.fillStyle = "#000";
visualCtx.fillRect(0,0, canvas.width, canvas.height);


animate(0, convertData(getWebsite("https://www.google.com"), 2));
sound(0, convertData(getWebsite("https://www.google.com"), 8));




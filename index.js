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
	setTimeout(function() { animate(n+1, input); }, 100/3);
}

function sound(n, input) {
	if(n === 0) {
		osc.connect(audioCtx.destination);
		  osc.start(0);
      osc.type = "sawtooth";
      // osc.frequency.value = 261.63;
      temp = [];
	}
    // var max = 523.25;
    // var min = 130.81;
	  osc.frequency.value = freq[input[n]];
    // osc.frequency.value = parseInt(input.substr(n, 10), 2);
    // var rand = randInt(130, 523);
    // var direction = 1;
    // if (rand < osc.frequency.value) {direction = -1;}
    // osc.frequency.value += direction * input[n] * 10;
	setTimeout(function() { sound(n+1, input); }, 500);
}



var canvas = document.getElementById("canvas");
var visualCtx = canvas.getContext("2d");


var audioCtx = new window.AudioContext();
var osc = audioCtx.createOscillator();
var doAnimate = true;
var freq = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25];

canvas.width = window.innerWidth;
canvas.height =  window.innerHeight;

visualCtx.fillStyle = "#000";
visualCtx.fillRect(0,0, canvas.width, canvas.height);

function image(input) {
    n = 0;
    imagecan = document.createElement('canvas');
    imagecan.width = Math.floor(Math.sqrt(input.length/6));
    imagecan.height = imagecan.width;
    document.body.appendChild(imagecan);
    ctx = imagecan.getContext("2d");

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

var url = "http://www.purple.com/purple.html"
animate(0, convertData(getWebsite(url), 2));
sound(0, convertData(getWebsite(url), 8));
image(convertData(getWebsite(url), 16));

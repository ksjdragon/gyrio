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
	var bitsPerSection = Math.ceil(canvas.width/width)+1;
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
	var frame1 = generateFrames(frame, input, 100, 100, 5);
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
		frame1= rotate(frame1,30);
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
	setTimeout(function() { animate(n+1, input) }, 100/3);
}

var doAnimate = true;
var visualCtx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height =  window.innerHeight;

visualCtx.fillStyle = "#1a1a1a";
visualCtx.fillRect(0,0, canvas.width, canvas.height);

document.getElementsByClassName("fa-search")[0].onclick = function() {
	var input = document.getElementById("urlInput");
	var value = input.value;
	if(value === "") return;
	var data;
	data = convertData(getWebsite(value),2);
	doAnimate = false;
	setTimeout(function() {
		doAnimate = true; 
		animate(0, data); 
	}, 100/3);
}

document.getElementsByClassName("fa-cog")[0].onclick = function() {
	document.getElementById("speedContainer").classList.toggle("show");
}

/*function sound(n, input) {
	if(n === 0) {
		osc.connect(audioCtx.destination);
		osc2.connect(audioCtx.destination);
		osc3.connect(audioCtx.destination);
		osc.start(0);
	}
	osc.frequency.value = freq[input[n]];
	setTimeout(function() { sound(n+1, input); }, 500); 
}
*/
/*var audioCtx = new window.AudioContext();
var osc = audioCtx.createOscillator();

var freq = [440, 494, 523, 587, 660, 698, 784, 880];
*/
//sound(0, convertData(getWebsite("https://www.google.com"), 8));

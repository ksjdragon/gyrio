var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height =  window.innerHeight;

var frames = [
	"0"
];

function randInt(min,max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateString() {
	var final = "";
	var length = randInt(50,100);
	for(var i = 0; i < length; i++) {
		final += randInt(0,1);
	}
	return final;
}

function generateFrames(string, speed) {
	// Speed is in bits per second

}

function drawFrame(frame) {
	ctx.beginPath();
	var frame = frames[frame];
	for(var i = 0; i < frame.length; i++) {
		if(frame[i] === "0") {
			console.log("asdf");
			ctx.beginPath();
			ctx.moveTo(0,canvas.height/2);
			ctx.lineTo(canvas.width,canvas.height/2);
			ctx.strokeStyle="#4CAF50";
			ctx.stroke();
		}
	}
}

function getWebsite(geturl) {
    xmlhttp=new XMLHttpRequest();
    xmlhttp.open("GET", geturl, false);
    xmlhttp.send();
    var data = xmlhttp.responseText;
}

ctx.fillStyle = "#000";
ctx.fillRect(0,0, canvas.width, canvas.height);
generateFrames(generateString());
drawFrame(0);

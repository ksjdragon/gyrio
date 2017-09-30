var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.width = screen.width;
canvas.height = screen.height;

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

console.log(generateString());

ctx.fillStyle = "#000";
ctx.fillRect(0,0, canvas.width, canvas.height);
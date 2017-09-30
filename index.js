function toBinary(text){
	var output = "";
	for (var i = 0; i < text.length; i++)
	{
		var letter = text[i].charCodeAt(0).toString(2);
		output += "0".repeat(8-letter.length) + letter;
	}
	return output;
}
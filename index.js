function getWebsite(geturl) {
    xmlhttp=new XMLHttpRequest();
    xmlhttp.open("GET", geturl, false);
    xmlhttp.send();
    var data = xmlhttp.responseText;
}

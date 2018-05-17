var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        myFunction(this, "abat");
    }
};
xhttp.open("GET", "slowa.xml", true);
xhttp.send();

function myFunction(xml, slowo) {
    var xmlDoc = xml.responseXML;
    document.getElementById("demo").innerHTML =
    xmlDoc.getElementById(slowo).getElementsByTagName("lexical-unit")[0].getElementsByTagName("form")[0].getElementsByTagName("text")[0].innerHTML;
}
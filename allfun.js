function myFunction() {
    // Declare variables
    var input, filter, table, tr, td, i;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("demo");
    tr = table.getElementsByTagName("tr");

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
            if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

function FirstLetterOnly() {
    // Declare variables
    var input, filter, table, tr, td, i;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("demo");
    tr = table.getElementsByTagName("tr");

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
            if (td.innerHTML.toUpperCase()[0] === filter) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}
    //var link;
    //const url = require('url');


var x;
//start program, create a list of available words from 
window.onload = function (){  
    /*var where = __dirname;
    var path = where.substr(0, where.length - 9);
    console.log(path);
    var cough = "file\\\\\\C:\\Users\\Desktop\\IO_Slownik\\sample.xml";
    console.log(cough)*/


    var xmlhttp, xmlDoc;
    xmlhttp = new XMLHttpRequest();
    xmlhttp.open("post", 'resources/sample.xml', false);
    xmlhttp.send();
    xmlDoc = xmlhttp.responseXML;
    document.getElementById("secondary").innerHTML = xmlDoc.getElementsByTagName("full-name")[0].childNodes[0].nodeValue;
    x = xmlDoc.getElementsByTagName("entry");

    table = "<tr><th></th></tr>";
    for (i = 0; i < x.length; i++) {
        table += "<tr onclick='displayCD(" + i + ")'><td>";
        table += x[i].getElementsByTagName("id")[0].childNodes[0].nodeValue;
        table += "</td></tr>";
    }
    document.getElementById("demo").innerHTML = table;

    sortMyList();
};

//window.onload = LoadProgram();

var cnt = -1;
var lista = [];
var zmiana = false;

function prevClick() {
    prevClick.called = true;
    displayCD(lista[cnt - 1]);
    cnt--;
    nextPrevButtons();
    prevClick.called = false;
    console.log(cnt);
}


//wyswietl liste secondary language
function displayListPL() {

    var xmlhttp, xmlDoc
    xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "resources/sample.xml", false);
    xmlhttp.send();
    xmlDoc = xmlhttp.responseXML;
    document.getElementById("pressed").innerHTML = xmlDoc.getElementsByTagName("full-name")[0].childNodes[0].nodeValue;


    x = xmlDoc.getElementsByTagName("entry");
    table = "<tr><th></th></tr>";


    for (i = 0; i < x.length; i++) {
        table += "<tr onclick='displayCD(" + i + ")'><td>";
        table += x[i].getElementsByTagName("word")[0].childNodes[0].nodeValue;
        table += "</td><td>";
    }
    document.getElementById("demo").innerHTML = table;

    sortMyList();
}

//wyswietl liste primary language
function displayListEN() {
    document.getElementById("pressed").innerHTML = "English";
    var xmlhttp, xmlDoc
    xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "resources/sample.xml", false);
    xmlhttp.send();
    xmlDoc = xmlhttp.responseXML;
    x = xmlDoc.getElementsByTagName("entry");
    table = "<tr><th></th></tr>";
    for (i = 0; i < x.length; i++) {
        table += "<tr onclick='displayCD(" + i + ")'><td>";
        table += x[i].getElementsByTagName("id")[0].childNodes[0].nodeValue;
        table += "</td><td>";
    }
    document.getElementById("demo").innerHTML = table;

    sortMyList();
}

//listy popedni następny
function nextClick() {
    nextClick.called = true;
    displayCD(lista[cnt + 1])
    cnt++;
    nextPrevButtons();
    nextClick.called = false;
    console.log(cnt);
}
//blokuje odblokowje
function nextPrevButtons() {
    if (lista.length > 1 && cnt > 0) {
        document.getElementById('prev').disabled = false;
    }
    if (lista.length > 1 && cnt != lista.length - 1) {
        document.getElementById('next').disabled = false;
    }
    if (cnt < 1) {
        document.getElementById('prev').disabled = true;
    }
    if (cnt >= lista.length - 1) {
        document.getElementById('next').disabled = true;
    }
    if (zmiana) {
        for (z = cnt + 1; z < lista.length; z++) {
            lista.pop()
        }
        zmiana = false;
        document.getElementById('next').disabled = true;
    }
}
//wyswietl slowo
function displayCD(i) {
    if (i === -1) {
        return;
    }
    document.getElementById("slowo").innerHTML =
        "Word: " +
        x[i].getElementsByTagName("id")[0].childNodes[0].nodeValue;
    document.getElementById("pfs").innerHTML =
        "Pfs: " +
        x[i].getElementsByTagName("pfs")[0].childNodes[0].nodeValue;
    document.getElementById("slowo2").innerHTML =
        "*: " +
        x[i].getElementsByTagName("word")[0].childNodes[0].nodeValue;
    relative = x[i].getElementsByTagName("synomym")[0].childNodes[0].nodeValue;
    if (!nextClick.called && !prevClick.called) {
        lista[cnt + 1] = i;
        cnt++;
        zmiana = true;
    }
    nextPrevButtons();
    document.getElementById("related").innerHTML =
        "<p id='sentence'></p><p id='sentence2'></p>" +
        "<p> <span id='synomym' onclick='displayCD(" + findRelative(relative) + ")'>" + relative + "</span></p>"
    document.getElementById("def").innerHTML =
        "Def: " +
        x[i].getElementsByTagName("def")[0].childNodes[0].nodeValue;
    document.getElementById("sentence").innerHTML =
        "Sentence: " +
        x[i].getElementsByTagName("sentence")[1].childNodes[0].nodeValue;
    document.getElementById("sentence2").innerHTML =
        "Sentence: " +
        x[i].getElementsByTagName("sentence")[0].childNodes[0].nodeValue;

    console.log("i=" + i);
    console.log("Count:=" + cnt)
}
//link do skojarzonego słowa
function findRelative(name) {
    var i = 0;
    for (i; i < x.length; i++) {
        if (x[i].getElementsByTagName("id")[0].childNodes[0].nodeValue == name) {
            break;
        }
    }
    if (i === x.length) {
        i = -1;
    }
    return i;
}

function sortMyList(){
    var table = document.getElementById("demo");
    //console.log(table);
    var tr = table.getElementsByTagName("TR");
    trl = tr.length;
    do{
        for(i = 1; i < trl-1; i++){
            var td = tr[i].getElementsByTagName("TD")[0].innerHTML;
            //console.log(td);
            var tdn = tr[i+1].getElementsByTagName("TD")[0].innerHTML;
            //console.log(tdn);
            if(td.localeCompare(tdn) == 1){
                tr[i].parentNode.insertBefore(tr[i+1],tr[i]);
            }
        }
        trl--;
    }while(trl > 1)
}
const electron = require('electron');//załadowanie funkcji electrona
const { ipcRenderer } = electron;//możliwosć wysyłania komunikatów między aplikacją electrona a stroną

var type = 1; //sortowanie rosnące, do zmiany
var next, prev, hpage, sound, alang;//elementy menu, aby dynamicznie zmieniać ich wartość
var picpath = ""; //ścieżka do obrazka
var soundpath = ""; //ścieżka do dźwięku
//oczekuj na zmianę języka menu
ipcRenderer.on('lang', (event, arg) => {
    console.log(arg);
    next = arg.next;
    prev = arg.prev;
    hpage = arg.hpage;
    sound = arg.sound;
    alang = arg.linfo;
    document.getElementById('next').innerHTML = '<i class="demo-icon icon-forward"></i><br/>' + next; //żeby były obrazki
    document.getElementById('prev').innerHTML = '<i class="demo-icon icon-reply"></i><br/>' + prev;
    document.getElementById('hpage').innerHTML = '<i class="demo-icon icon-home-outline"></i><br><nobr>' + hpage + '<nobr/>';
    document.getElementById('wymowa').innerHTML = '<i class="demo-icon icon-volume-up"></i><br><nobr>' + sound + '<nobr/>';
    document.getElementById('ojezyku').innerHTML = '<i class="demo-icon icon-info"></i><br><nobr>' + alang + '<nobr/>';
})

function myFunction() { //filtrowanie rekordów w liście
    // Declare variables
    var input, filter, table, tr, td, i; //input - tekst wejściowy,
    //filter - zamiana znaków na duże znaki, table - lista słów, tr, td - elementy tabeli, i - licznik
    input = document.getElementById("myInput"); //myInput - search bar
    filter = input.value.toUpperCase();
    table = document.getElementById("demo"); //tabela rekordów
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

function FirstLetterOnly() { //funkcja jak MyFunction, ale nie wyszukiwany jest wzorzec a wyłącznie początek - do listowania rekordow na dana litere
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

//x - zaladowany xml do JS
var x;
//start program, create a list of available words from 
window.onload = function () {
    /*var where = __dirname;
    var path = where.substr(0, where.length - 9);
    console.log(path);
    var cough = "file\\\\\\C:\\Users\\Desktop\\IO_Slownik\\sample.xml";
    console.log(cough)*/

    //Wykorzystanie AJAX do załadowania xmla
    ipcRenderer.send('doc-ready', true);
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

	
    sortMyList(type);
    for(i = 0; i < 26; i++)
	document.getElementById("alphabet").innerHTML += '<input type="button" class="literken" style="width: 30px; height: 25.5px;" value="' + String.fromCharCode(65+i) + '" onClick="alercik(this.value)"/><br/>';
	loadCategories();

    const ojezykubutton = document.getElementById("ojezyku");
    ojezykubutton.addEventListener('click', OpenOJezyku);

    const wymowabutton = document.getElementById("wymowa");
    wymowabutton.addEventListener('click', OpenWymowa);

    function OpenOJezyku(e) {
        e.preventDefault();
        ipcRenderer.send('ojezyku', true);
    }

    function OpenWymowa(e) {
        e.preventDefault();
        document.getElementById('play').innerHTML = '<audio autoplay><src="resources/moo.wav" type="audio/wav"></audio>';
    }
};

//window.onload = LoadProgram();
// zmienne pomocnicze do obslugi listy odwiedzonych rekordow
var cnt = -1;
var lista = [];
var zmiana = false;

//zaladowanie poprzedniego rekordu
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

    sortMyList(type);

    document.getElementById('myInput').value = "";
	
	document.getElementById("alphabet").innerHTML = "";
	var napis = xmlDoc.getElementsByTagName("alphabet")[0].childNodes[0].nodeValue;
	n = napis.length;
	const hgh = (664/n);
	for (i = 0; i < n; i++)
	document.getElementById("alphabet").innerHTML += '<input type="button" class="literken" style="width: 30px; height: '+hgh+'px;" value="' + napis.charAt(i) + '" onClick="alercik(this.value)"/><br/>';
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

    sortMyList(type);

    document.getElementById('myInput').value = "";
	
	document.getElementById("alphabet").innerHTML = "";
	for(i = 0; i < 26; i++)
	document.getElementById("alphabet").innerHTML += '<input type="button" class="literken" style="width: 30px; height: 25.5px;" value="' + String.fromCharCode(65+i) + '" onClick="alercik(this.value)"/><br/>';
}

//wyświetl kategorie
function loadCategories() {
    var xmlhttp, xmlDoc;
    xmlhttp = new XMLHttpRequest();	
    xmlhttp.open("GET", "resources/sample.xml", false);
    xmlhttp.send();
    xmlDoc = xmlhttp.responseXML;
	y = xmlDoc.getElementsByTagName("category")[0].childNodes;
	for(i=1; i < y.length; i +=2) {
		lista2 = "";
		x = xmlDoc.getElementsByTagName("category")[0].childNodes[i].childNodes[0].nodeValue;
		lista2 += "<li><a href='#' onClick='sortMyListByCat("+i+")' id='secondary'  style='font-size: 16px;'>";
		//alert(i);
		lista2 += x;
		lista2 += "</a></li>";	
		document.getElementById("listUL").innerHTML += lista2;
	}
}

function sortMyListByCat(cat) { //wyświetla listę posortowaną wg kategorii
	var xmlhttp, xmlDoc;
    xmlhttp = new XMLHttpRequest();	
    xmlhttp.open("GET", "resources/sample.xml", false);
    xmlhttp.send();
    xmlDoc = xmlhttp.responseXML;
	c = xmlDoc.getElementsByTagName("category")[0].childNodes[cat].childNodes[0].nodeValue;

	x = xmlDoc.getElementsByTagName("entry");
    table = "<tr><th></th></tr>";
    for (i = 0; i < x.length; i++) {
		if(x[i].getElementsByTagName("category")[0].childNodes[0].nodeValue==c) {
			table += "<tr onclick='displayCD(" + i + ")'><td>";
			table += x[i].getElementsByTagName("id")[0].childNodes[0].nodeValue;
			table += "</td><td>";
		}
    }
    document.getElementById("demo").innerHTML = table;

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
//blokuje odblokowuje buttony poprzedni i nastepny
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
	
	content = "<div id='wordMain'><p id='slowo'></p></div><div id='word'><p id='pfs'></p><p id='slowo2'></p></div><div id='definition'></div><div id='picture'><p id='def'></p></div><div id='related'><p id='sentence'></p><p id='sentence2'></p></div>";
	
	document.getElementById("window").innerHTML = content;
	
	var xmlhttp, xmlDoc;
    xmlhttp = new XMLHttpRequest();
    xmlhttp.open("post", 'resources/sample.xml', false);
    xmlhttp.send();
    xmlDoc = xmlhttp.responseXML;
    x = xmlDoc.getElementsByTagName("entry");
    document.getElementById("slowo").innerHTML = //duży napis słowo w zależności od wybranego layoutu
        x[i].getElementsByTagName("id")[0].childNodes[0].nodeValue;
    document.getElementById("pfs").innerHTML = //pfs - cześć mowy
        x[i].getElementsByTagName("pfs")[0].childNodes[0].nodeValue;
    document.getElementById("slowo2").innerHTML = //tłumaczenie słowa
        x[i].getElementsByTagName("word")[0].childNodes[0].nodeValue;
    relative = x[i].getElementsByTagName("synomym")[0].childNodes[0].nodeValue; //synonim, literówka
    if (!nextClick.called && !prevClick.called) { //kontrola przycików poprzednie, następne hasło
        lista[cnt + 1] = i;
        cnt++;
        zmiana = true;
    }
    nextPrevButtons();
    soundpath = "";
    picpath = "";
    if(x[i].getElementsByTagName("sound")[0].childNodes[0] != null){
        console.log(x[i].getElementsByTagName("sound")[0].childNodes[0]);
        soundpath = x[i].getElementsByTagName("sound")[0].childNodes[0].nodeValue;
    }
    if(x[i].getElementsByTagName("img")[0].childNodes[0] != null){
        console.log(x[i].getElementsByTagName("img")[0].childNodes[0]);
        picpath = x[i].getElementsByTagName("img")[0].childNodes[0].nodeValue;
    }
    loadimg();
    document.getElementById("related").innerHTML = //w related znajdują sie zdania z zastosowaniem danego słowa - w języku jednym i drugim
        "<p id='sentence'></p><p id='sentence2'></p>" +
        "<p> <span id='synomym' onclick='displayCD(" + findRelative(relative) + ")'>" + relative + "</span></p>"
    document.getElementById("def").innerHTML =
        x[i].getElementsByTagName("def")[0].childNodes[0].nodeValue;
    document.getElementById("sentence").innerHTML =
        x[i].getElementsByTagName("sentence")[1].childNodes[0].nodeValue;
    document.getElementById("sentence2").innerHTML =
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

//sortowanie listy rekordów (A-Z)
function sortMyList(type) {
    var table = document.getElementById("demo");
    //console.log(table);
    var tr = table.getElementsByTagName("TR");
    trl = tr.length;
    do {
        for (i = 1; i < trl - 1; i++) {
            var td = tr[i].getElementsByTagName("TD")[0].innerHTML;
            //console.log(td);
            var tdn = tr[i + 1].getElementsByTagName("TD")[0].innerHTML;
            //console.log(tdn);
            if (td.localeCompare(tdn) == type) {
                tr[i].parentNode.insertBefore(tr[i + 1], tr[i]);
            }
        }
        trl--;
    } while (trl > 1)
}



function changeNamePlates() {//funkcja testowa, sprawdzanie odebrania paczki językowej z MAIN
    ipcRenderer.on('lang', (event, arg) => {
        console.log(arg);
    })
}

function muzyka() { //odtwarzanie wymowy jeżeli istnieje
    if (soundpath != "") {
        var audio = new Audio(soundpath);
        audio.currentTime = 0;
        audio.play();
    }
}

function ustawKolejnosc(how){
    type = how;
    sortMyList(type);
}

function loadimg() { //załaduj obrazek jezeli istnieje
    if(picpath !== ""){
        document.getElementById("picture").innerHTML = '<img style="width: 50%; heigth: 50%" src="' + picpath + '"/>';
    }
    else{
        document.getElementById("picture").innerHTML = "";
    }
    document.getElementById("picture").innerHTML += '<p id="def"></p>';
}

function homepage() { //wyświetl stronę główną, czyści historię odwiedzonych haseł
		document.getElementById("window").innerHTML = "<img src='1024x1024.png' style='width: 80%; margin-left: auto; margin-right: auto; display: block;'>";
		soundpath = "";

		cnt = -1;
		lista = [];
		nextPrevButtons();
}
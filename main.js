//załadowanie funkcjonalnosci electrona
const electron = require('electron');
const path = require('path');
const url = require('url');
const { app, BrowserWindow, Menu, ipcMain, shell } = electron;

let mainWindow;
let lnWindow;

var check = false;

var file, exit, print, alang, lmenu;
let language = 'polish';

ipcMain.on('doc-ready', function(){
    check = true;
})

//paczki językowe
var languagepack = {
    'polish': {
        'lmenu' : 'Język...',
        'language': 'Polski',
        'prev': 'Poprzedni',
        'next': 'Nastepny',
        'hpage': 'Strona główna',
        'sound': 'Wymowa',
        'linfo': 'O języku',
        'file': 'Plik',
        'exit': 'Wyjście',
        'print': 'Wrukuj'
    },
    'english': {
        'lmenu' : 'Language...',
        'language': 'English',
        'prev': 'Previous',
        'next': 'Next',
        'hpage': 'Home page',
        'sound': 'Pronunce',
        'linfo': 'About Language',
        'file': 'File',
        'exit': 'Exit',
        'print': 'Print'
    },
    'french': {
        'lmenu' : 'Langue...',
        'language': 'Français',
        'prev': 'Précédent',
        'next': 'Prochain',
        'hpage': 'Page d\'accueil',
        'sound': 'Prononciation',
        'linfo': 'Sur la langue',
        'file': 'Fichier',
        'exit': 'Sortir',
        'print': 'Imprimer'
    },
    'german': {
        'lmenu': 'Sprache...',
        'language': 'Deutsch',
        'prev': 'Vorheriges',
        'next': 'Nächstes',
        'hpage': 'Startseite',
        'sound': 'Sussprache',
        'linfo': 'Über Sprache',
        'file': 'Datei',
        'exit': 'Beenden',
        'print': 'Drucken'
    }
}
//załaduj język (początkowo angielski)
loadLanguage(language);

//Wzór menu
const addMenuTemp = [];
const mainMenuTemp = []/* = [
    {
        label: file,
        submenu: [
            {
                label: exit,
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click() {
                    app.quit();
                }
            },
            {
                label: print,
                click() {
                    let contents = mainWindow.webContents;
                    contents.print({ silent: false, printBackground: true });

                }
            },
            {
                label: alang,
                click() {
                    createLanguageNotewindow();
                }
            },
            {
                label: 'language',
                submenu: [{
                    label: 'Polski',
                    click(){
                        language = 'polish';
                        loadLanguage(language);
                        buildMenu();
                    }
                },
                {
                    label: 'English',
                    click(){
                        language = 'english';
                        loadLanguage(language);
                        buildMenu();
                    }

                },
                {
                    label: 'Deutsch',
                    click(){
                        language = 'german';
                        loadLanguage(language);
                        buildMenu();
                    }
                },
                {
                    label: 'Français',
                    click(){
                        language = 'french';
                        loadLanguage(language);
                        buildMenu();
                    }
                }]
            }
        ]
    }
]*/

buildMenu();

//otwarcie okna o jezyku po uzyskaniu odpowiedniej wiadomosci ze strony
ipcMain.on('ojezyku', function () {
    createLanguageNotewindow();
})

ipcMain.on('wymowa', function () {

})

//utwórz okno o języku
function createLanguageNotewindow() {
    lnWindow = new BrowserWindow({
        show: false
    });

    lnWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'OJezyku.html'),
        protocol: 'file:',
        slashes: true
    }))

    lnWindow.on('ready-to-show', function () {
        lnWindow.show();
    })

    lnWindow.on('close', function () {
        lnWindow = null;
    })

    //const menu = Menu.buildFromTemplate(addMenuTemp);
    //Menu.setApplicationMenu(lnWindow);
}


//Nasłuchuj gotowość aplikcji
app.on('ready', function () {
    //Stwórz okno
    mainWindow = new BrowserWindow({
        maximizable: false,
        resizable: false,
        width: 1120,
        height: 796,
        /*maxHeight: 796,
        minHeight: 796,
        maxWidth: 1120,
        minWidth: 1120,*/
        show: false
    });
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'slownik.html'),
        protocol: 'file:',
        slashes: true
    }));
    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
    })

    mainWindow.on('closed', function () {
        mainWindow = null;
        lnWindow = null;
        app.quit();
    })

    //Fix błędu na MacOS
    if (process.platform == 'darwin') {
        mainMenuTemp.unshift({});
    }

    //Buduj menu ze wzoru
    //buildMenu();

    //Wyślij miejsce w którym jest xml
    //loadExternalXML();
})



function buildMenu() {
    console.log(file);
    if (process.env.NODE_env !== 'production') { mainMenuTemp.pop();}
    mainMenuTemp.pop();
    mainMenuTemp.push(
        {
            label: file,
            submenu: [
                {
                    label: exit,
                    accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                    click() {
                        app.quit();
                    }
                },
                {
                    label: print,
                    click() {
                        let contents = mainWindow.webContents;
                        contents.print({ silent: false, printBackground: true });

                    }
                },
                {
                    label: alang,
                    click() {
                        createLanguageNotewindow();
                    }
                },
                {
                    label: lmenu,
                    submenu: [{
                        label: 'Polski',
                        click() {
                            language = 'polish';
                            loadLanguage(language);
                            buildMenu();
                        }
                    },
                    {
                        label: 'English',
                        click() {
                            language = 'english';
                            loadLanguage(language);
                            buildMenu();
                        }

                    },
                    {
                        label: 'Deutsch',
                        click() {
                            language = 'german';
                            loadLanguage(language);
                            buildMenu();
                        }
                    },
                    {
                        label: 'Français',
                        click() {
                            language = 'french';
                            loadLanguage(language);
                            buildMenu();
                        }
                    }]
                }
            ]
        }
    )
    //Dodaj narzędzia dev jesli nie w produkcji
    if (process.env.NODE_env !== 'production') {
        mainMenuTemp.push({
            label: 'Dev Tools',
            submenu: [{
                label: 'Pokaż narzędzia',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'Reload'
            }
            ]
        })
    }
    const mainMenu = new Menu.buildFromTemplate(mainMenuTemp);
    Menu.setApplicationMenu(mainMenu);
}

function loadLanguage(lang) {
    if (lang === 'polish') {
        lmenu = languagepack.polish.lmenu;
        file = languagepack.polish.file;
        print = languagepack.polish.print;
        exit = languagepack.polish.exit;
        alang = languagepack.polish.linfo;
        if(check){
        mainWindow.webContents.send('lang', languagepack.polish);
        }
    }
    if (lang === 'english') {
        lmenu = languagepack.english.lmenu;
        file = languagepack.english.file;
        print = languagepack.english.print;
        exit = languagepack.english.exit;
        alang = languagepack.english.linfo;
        if(check){
            mainWindow.webContents.send('lang', languagepack.english);
        }
    }
    if (lang === 'french') {
        lmenu = languagepack.french.lmenu;
        file = languagepack.french.file;
        print = languagepack.french.print;
        exit = languagepack.french.exit;
        alang = languagepack.french.linfo;
        if(check){
            mainWindow.webContents.send('lang', languagepack.french);
        }
    }
    if (lang === 'german') {
        lmenu = languagepack.german.lmenu;
        file = languagepack.german.file;
        print = languagepack.german.print;
        exit = languagepack.german.exit;
        alang = languagepack.german.linfo;
        if(check){
            mainWindow.webContents.send('lang', languagepack.german);
        }
    }
    //buildMenu();
}



//zmienna pomocnicza - obecnie nie wykorzystana
var fileurl = url.format({
    pathname: path.join(__dirname, 'resources/example.xml'),
    protocol: 'file:',
    slashes: true
})
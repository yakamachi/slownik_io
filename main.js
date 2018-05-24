const electron = require('electron');
const path = require('path');
const url = require('url');
const { app, BrowserWindow, Menu, ipcMain, shell } = electron;

let mainWindow;
let lnWindow;

ipcMain.on('ojezyku', function(){
    createLanguageNotewindow();
})

function createLanguageNotewindow() {
    lnWindow = new BrowserWindow({
    });

    lnWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'OJezyku.html'),
        protocol: 'file:',
        slashes: true
    }))

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
        width: 1120,
        height: 796,
        maxHeight: 796,
        minHeight: 796,
        maxWidth: 1120,
        minWidth: 1120,
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



    //Fix błędu na MacOS
    if (process.platform == 'darwin') {
        mainMenuTemp.unshift({});
    }

    //Buduj menu ze wzoru
    const mainMenu = Menu.buildFromTemplate(mainMenuTemp);
    Menu.setApplicationMenu(mainMenu);

    //Wyślij miejsce w którym jest xml
    //loadExternalXML();
})

//Wzór menu
const addMenuTemp = [];
const mainMenuTemp = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Exit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click() {
                    app.quit();
                }
            },
            {
                label: 'Print',
                click() {
                    let contents = mainWindow.webContents;
                    contents.print({ silent: false, printBackground: true });

                }
            },
            {
                label: 'Notka o języku',
                click() {
                    createLanguageNotewindow();
                }
            }
        ]
    }
]

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


var fileurl = url.format({
    pathname: path.join(__dirname, 'resources/example.xml'),
    protocol: 'file:',
    slashes: true
})
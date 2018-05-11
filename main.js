const electron = require('electron');
const path = require('path');
const url = require('url');
const {app, BrowserWindow, Menu} = electron;

let mainWindow;

//Nasłuchuj gotowość aplikcji
app.on('ready', function(){
    //Stwórz okno
    mainWindow = new BrowserWindow({
        width: 1124,
        height: 796,
        maxHeight: 796,
        minHeight: 796,
        maxWidth: 1124,
        minWidth: 1124,
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
    if(process.platform == 'darwin'){
        mainMenuTemp.unshift({});
    }

    //Buduj menu ze wzoru
    const mainMenu = Menu.buildFromTemplate(mainMenuTemp);
    Menu.setApplicationMenu(mainMenu);
})

//Wzór menu
const mainMenuTemp = [
    {
        label: 'File',
        submenu:[
            {
                label: 'Previous'
            },
            {
                label: 'Next',
            },            
            {
                label: 'Exit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click(){
                    app.quit();
                }
            }
        ]
    }
]

//Dodaj narzędzia dev jesli nie w produkcji
if(process.env.NODE_env !== 'production'){
    mainMenuTemp.push({
        label: 'Dev Tools',
        submenu:[{
            label: 'Pokaż narzędzia',
            accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
            click(item, focusedWindow){
                focusedWindow.toggleDevTools();
            }
            },
            {
                role: 'Reload'
            }
        ]
    })
}
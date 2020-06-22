
if (require('electron-squirrel-startup')) return;
//const app = require('app');

// this should be placed at top of main.js to handle setup events quickly
if (handleSquirrelEvent()) {
    // squirrel event handled and app will exit in 1000ms, so don't do anything else
    return;
}
const {app, BrowserWindow} = require('electron')
const url = require('url');
const path = require('path');
var os = require('os');
//global.branch = process.argv[2];
let win
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
function createWindow() {
   // win = new BrowserWindow({width: 800, height: 1200})
    win = new BrowserWindow({ width: 800, height: 1200,icon: __dirname + "./icon.ico", webPreferences: { nodeIntegration: true, enableRemoteModule:true} });
    win.loadURL(url.format ({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))

    const Menu = require('electron').Menu;
    const menu = Menu.buildFromTemplate(menuTemplate);
  //  Menu.setApplicationMenu(menu);
}
//app.commandLine.appendSwitch('remote-debugging-port', '9222')
app.on('ready', createWindow)



const menuTemplate = [ // create replacement menu here
    {
        label: 'Electron',
        submenu: [
            {
                label: 'About ...',
                click: () => {
                    console.log('About Clicked');
                }
            }, {
                type: 'separator'
            }, {
                label: 'Quit',
                click: () => {
                    app.quit();
                }
            }
        ]

    },
    {
        label: 'second',
        submenu: [
            {
                label: 'what ...',
                click: () => {
                    console.log('what Clicked');
                }
            }]
    }
];

//*******************************  Installer electron-forge stuff here ******************************
function handleSquirrelEvent() {
    if (process.argv.length === 1) {
        return false;
    }

    const ChildProcess = require('child_process');
    const path = require('path');

    const appFolder = path.resolve(process.execPath, '..');
    const rootAtomFolder = path.resolve(appFolder, '..');
    const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
    const exeName = path.basename(process.execPath);

    const spawn = function(command, args) {
        let spawnedProcess, error;

        try {
            spawnedProcess = ChildProcess.spawn(command, args, {detached: true});
        } catch (error) {}

        return spawnedProcess;
    };

    const spawnUpdate = function(args) {
        return spawn(updateDotExe, args);
    };

    const squirrelEvent = process.argv[1];
    switch (squirrelEvent) {
        case '--squirrel-install':
        case '--squirrel-updated':
            // Optionally do things such as:
            // - Add your .exe to the PATH
            // - Write to the registry for things like file associations and
            //   explorer context menus

            // Install desktop and start menu shortcuts
            spawnUpdate(['--createShortcut', exeName]);

            setTimeout(app.quit, 1000);
            return true;

        case '--squirrel-uninstall':
            // Undo anything you did in the --squirrel-install and
            // --squirrel-updated handlers

            // Remove desktop and start menu shortcuts
            spawnUpdate(['--removeShortcut', exeName]);

            setTimeout(app.quit, 1000);
            return true;

        case '--squirrel-obsolete':
            // This is called on the outgoing version of your app before
            // we update to the new version - it's the opposite of
            // --squirrel-updated

            app.quit();
            return true;
    }
};
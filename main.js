const electron = require('electron')
    // Module to control application life.
const app = electron.app
    // Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
const fs = require("fs");
const path = require('path')
const url = require('url')
const axios = require("axios").default;

function doRedditAuth() {
    return new Promise((resolve, reject) => {
        var authWindow = new BrowserWindow({
            width: 800,
            height: 600,
            show: false,
            'node-integration': false,
            'web-security': false
        });
        // This is just an example url - follow the guide for whatever service you are using
        var authUrl = 'https://www.reddit.com/api/v1/authorize?client_id=h5yiNpGGdCGsng&response_type=code&state=RANDOM_STRING&redirect_uri=' + encodeURIComponent("http://REDIRECT.invalid/") + '&duration=permanent&scope=identity,read,submit'
        authWindow.loadURL(authUrl);
        authWindow.show();
        // 'will-navigate' is an event emitted when the window.location changes
        // newUrl should contain the tokens you need
        authWindow.webContents.on('will-navigate', function(event, newUrl) {
            console.log(newUrl);
            // More complex code to handle tokens goes here
            if (newUrl.startsWith("http://redirect.invalid")) {
                var querystring = require('querystring');
                var code = querystring.parse(newUrl.replace("http://redirect.invalid/", "")).code;
                axios.post("https://www.reddit.com/api/v1/access_token",
                    "grant_type=authorization_code&code=" + code + "&redirect_uri=" + encodeURIComponent("http://REDIRECT.invalid/"), {
                        auth: {
                            username: "h5yiNpGGdCGsng",
                            password: ""
                        }
                    }).then(res => {
                    fs.writeFileSync("./code.secret", res.data.access_token + "\n" + res.data.refresh_token);
                    resolve(code)
                }).catch(res => {
                    console.log(res);
                })
            }
        });
        authWindow.on('closed', function() {
            authWindow = null;
        });
    })
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function doMainWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({ width: 800, height: 600 })

    // and load the index.html of the app.
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))

    // Open the DevTools.
    mainWindow.webContents.openDevTools()
    mainWindow.setMenu(null);
    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })
}

function createWindow() {
    if (!fs.existsSync("./code.secret")) {
        doRedditAuth().then(c => {
            doMainWindow();
        })
    } else {
        doMainWindow();
    }


}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function() {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
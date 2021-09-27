const { app, BrowserWindow } = require("electron");
const path = require("path");
const url = require("url");

let indexWindow;

require("electron-reload")(__dirname);

app.on("ready", createWindow);

function createWindow() {
  // create browser window
  indexWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    },
    minWidth: 1200,
    // maxHeight: 680,
    minHeight: 680,
    center: true
  });

  // load index.html
  indexWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "index.html"),
      protocol: "file",
      slashes: true
    })
  );
  // indexWindow.webContents.openDevTools({ mode: "undocked" });
  indexWindow.on("closed", function() {
    indexWindow = null;
  });
  // indexWindow.fullScreenable = false;
  // indexWindow.maximizable = false;
  indexWindow.resizable = true;
  // show the page once the rendered process have fully rendered the page
  indexWindow.once("ready-to-show", () => {
    indexWindow.show();
  });
}

// quit when all windows are closed
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

import { app, session, BrowserWindow, ipcMain as ipc } from 'electron';
import { format } from 'url';
import log from 'electron-log';


import {
  WELCOME_WINDOW_WIDTH,
  WELCOME_WINDOW_HEIGHT,
  WELCOME_HASH,
  MAIN_WINDOW_SIZE,
  MAIN_HASH,
} from '../../shared/constants';

const singleton = true;

const manager = {
  windows: {},
  welcome: null,
  projectCreate: null,
  singleton: null,
  current: null,
};

exports.setCurrent = win => (manager.current = win);

exports.getCurrent = () => manager.current;

exports.getSizeOfWindows = () => Object.keys(manager.windows).length;

exports.newWindow = (options, callback) => new Window(options, callback);

exports.Window = Window;

exports.newMainWindow = function newMainWindow() {
  
  return new Window({
    ...MAIN_WINDOW_SIZE,
    htmlHash: MAIN_HASH,
    resizable: false,
    webPreferences: {
      webSecurity: false,
    }
  }, () => {
    // checkLatest(false);
  });
}

exports.newMallSessionWindow = function(url, partition) {
  const newWindow = new Window({
    url,
    partition,
    htmlHash: WELCOME_HASH,
    width: WELCOME_WINDOW_WIDTH,
    height: WELCOME_WINDOW_HEIGHT,
    resizable: true,
  
  }, () => {
    // checkLatest(false);
  });
 
  return newWindow;
}

exports.newWelcomeWindow = function newWelcomeWindow() {
  
  const newWindow = new Window({
    url: 'https://weibo.com',
    htmlHash: WELCOME_HASH,
    width: WELCOME_WINDOW_WIDTH,
    height: WELCOME_WINDOW_HEIGHT,
    resizable: true,
  
  }, () => {
    // checkLatest(false);
  });
 
  return newWindow;
};


exports.closeWelcomeWindow = () => {
  manager.welcome.close();
};



exports.closeCurrent = (callback) => {
  manager.current.close((win) => {
    if (callback) return callback();
    defaultCloseCallBack(win);
  });
};

exports.getWindowById = id => manager.windows[id];

const getFocusedWindow = () => {
  const window = BrowserWindow.getFocusedWindow();
  return manager.windows[window.id];
};

const defaultCloseCallBack = (win) => {
  if (win.type === WELCOME_HASH && Object.keys(manager.windows).length === 0) {
    app.quit();
  }  else {
    // eslint-disable-next-line no-new
    // new Window({
    //   htmlHash: WELCOME_HASH,
    //   width: WELCOME_WINDOW_WIDTH,
    //   height: WELCOME_WINDOW_HEIGHT,
    //   resizable: false,
    // });
  }
};

class Window {
  constructor(options, callback) {
    const localOpt = {};
    let url = format({
      protocol: 'file',
      pathname: options.pathName || `${$dirname}/../pages/index.html`,
      slashes: true,
      hash: options.htmlHash,
    });

    if (options.url) {
      url = options.url;
    } else {
      this.type = options.htmlHash.split('?')[0];
    }
    
    if (process.platform === 'darwin') localOpt.titleBarStyle = 'hidden';
    
    let { partition = '' } = options; 
    delete options.partition;
    if (partition) {
      partition = `persist:${partition}`;
    }

    // const ses = session.fromPartition(partition);
    // log.info(`in new welcome window ------- ${partition}`);
    // log.info(ses);
    log.info(`in new welcome window ------- ${partition}`);
    this.browserWindow = new BrowserWindow({
      ...options,
      ...localOpt,
      show: false,
      webPreferences: {
        // webSecurity: true,
        // allowRunningInsecureContent: true,
        partition
        // session: ses,
      }
    });

    this.on('ready-to-show', () => {
      log.info('in ready to show');
      this.show();
      if (callback) callback();
    });

    this.handleEvent();

    this.webContents = this.browserWindow.webContents;
    // 禁用WebRTC暴露客户端IP地址
    this.webContents.setWebRTCIPHandlingPolicy('disable_non_proxied_udp');

    this.id = this.browserWindow.webContents.windowId = this.browserWindow.id;
    this.disposeFn = [];
    this.selfClosed = true;

    this.browserWindow.loadURL(url);
  }

  show = () => this.browserWindow.show();

  close = (arg1) => {
    if (this.browserWindow && !this.isDestroyed()) {
      this.closedCallback = arg1;
      this.browserWindow.close();
    }
  }

  destroy = () => {
    if (this.browserWindow && !this.isDestroyed()) {
      this.browserWindow.destroy();
    }
  }

  on = (event, callback) => this.browserWindow.on(event, callback);

  once = (event, callback) => this.browserWindow.once(event, callback);

  isDestroyed = () => this.browserWindow.isDestroyed();

  loadURL = (url, options) => this.browserWindow.loadURL(url, options);

  isMaximized = () => this.browserWindow.isMaximized();

  maximize = () => this.browserWindow.maximize();

  unmaximize = () => this.browserWindow.unmaximize();

  addDispose = (fn) => {
    this.disposeFn.push(fn);
  }

  dispose = () => {
    this.disposeFn.map(dispose => dispose());
  }

  handleEvent = () => {
    this.browserWindow.on('close', (event) => {
      try {
        this.dispose();
      } catch (error) {
        event.preventDefault();
        throw new Error(error);
      }
    });

    this.on('closed', () => {
      if (global.appIsReadyToQuit) return;
      
      if (this.type === WELCOME_HASH) manager.welcome = null;
  
      if (singleton) {
        manager.current = null;
      } else {
        manager.current = getFocusedWindow();
      }

      if (this.closedCallback) {
        this.closedCallback(this);
      } else {
        defaultCloseCallBack(this);
      }
    });
    this.on('focus', () => {
      manager.current = this;
    });
  }
}

// ipc监听renderer线程
ipc.on('window:doubleClickTitleBar', (e) => {
  const window = manager.windows[e.sender.windowId];
  if (window && !window.isDestroyed()) {
    if (window.isMaximized()) {
      window.unmaximize();
    } else {
      window.maximize();
    }
  }
});

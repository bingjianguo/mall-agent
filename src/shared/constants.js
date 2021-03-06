
// Project Tree Root Path
export const ROOT_PATH = '.';

// Window Size

export const WELCOME_WINDOW_WIDTH = 818;
export const WELCOME_WINDOW_HEIGHT = 460;

export const MALL_WINDOW_SIZE = { width: 800, height: 600 };
export const MAIN_WINDOW_SIZE = { width: 1024, height: 768 };
// window title
export const IDE_TITLE = '多用户登录';

// Drag And Drop
export const DND_PROJECTTREE_MOVE = 'DND/ProjectTree/Move';

// Chrome Debugger Remote
export const PORT = '9222';

// Settings
export const APPLICATION_OEPN_SETTINGS = 'APPLICATION_OEPN_SETTINGS';

// Preview
export const PREVIEW_ON_DEVICE_LOGS = 'PREVIEW_ON_DEVICE_LOGS';

// Publish
export const PUBLISH_LOGS = 'PUBLISH_LOGS';

export const MAIN_HASH = '/main';
export const WELCOME_HASH = '/welcome';

export const TIMEZONEMAP = {
  CDT: -5,
  EDT: -4,
  MDT: -6,
  PDT: -7,
  JST: +9,
  CET: +1
};

export const FAKE_DATA_ARRAY = [{
  id: 0,
  name: '美国东部时区LA',
  proxy: '47.52.1.5',
  port: '30012',
  userAgent: 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.186 Safari/537.36',
  acceptLanguage: 'en-us,en;q=0.5',
  screen: { width: 1920, height: 1080},
  size: {width: 1904, height: 970},
  timezone: 'CDT', // EST
  tzoffset: TIMEZONEMAP['CDT']
}, {
  id: 1,
  name: '美国中央时区CT',
  proxy: '47.52.1.5',
  port: '31001',
  userAgent: 'Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US) AppleWebKit/534.16 (KHTML, like Gecko) Chrome/10.0.648.11 Safari/534.16',
  acceptLanguage: 'en-us,en;q=0.5',
  screen: { width: 1920, height: 1080},
  size: { width: 1903, height: 974 },
  timezone: 'EDT', // CST
  tzoffset: TIMEZONEMAP['EDT']
}]
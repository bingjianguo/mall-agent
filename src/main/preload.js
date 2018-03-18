process.once('loaded', () => {
  let { currentEnv } = process.env;
  try {
    currentEnv = JSON.parse(currentEnv);
  } catch (err) {
    currentEnv = {};
  }

  const { timezone } = currentEnv;
  
  if (typeof module === 'object') {
    // Require Electron, IPC, other modules here
    window.module = module;
    module = undefined;
  }

  /**
   * 时间时区处理函数
   */
  window.OriginDate = window.Date;

  window.Date = () => {
    const d = new OriginDate();
    // const proxyObj = new Proxy(obj, )
    const localTime = d.getTime();
    const localOffset = d.getTimezoneOffset() * 60000;  
    const utc = localTime + localOffset; //得到国际标准时间  
    // 手动改变所在时区的偏移量
    const offset = currentEnv.tzoffset;  
    const calctime = utc + (3600000*offset);  
    const targetDate = new OriginDate(calctime);  
    // console.log('local time'+ targetDate.toLocaleTimeString());
    targetDate.getTimezoneOffset = () => {
      
      return offset*60;
    }

    targetDate.getTime = () => {
      const time = OriginDate.prototype.getTime.call(targetDate);
      // CST -0400  offset      0 * 2
      // EST -0500  offset+2    1 * 2
      // MDT -0600  offset+4    2 * 2
      // PST -0700  offset+6    3 * 2
      const diffZone = d.getTimezoneOffset() / (-60);
      return time + (offset + diffZone ) * 3600 * 1000;
    }

    
    targetDate.toString = () => {
      const str = OriginDate.prototype.toString.call(targetDate);
      const arr = str.split( /(GMT|UTC)([+-]\d\d\d\d)/g);
      const addZero = (str,length) => {
        return new Array(length - str.length + 1).join("0") + str;
      }
     
      let temp = addZero(Math.abs(offset)+'', 2) + '00';
      arr[2] = offset > 0 ? `+${temp}` : `-${temp}`;
      arr[3] = ` (${timezone})`;
      return arr.join('');
    }
    return targetDate;
  }


  
  if (currentEnv && currentEnv.screen) {
    /**
     * screen处理
     */
    const { screen } = currentEnv;
    Object.defineProperty(window.screen, 'width', {
      value: screen.width,
      writable: true,
      enumerable: true,
      configurable: true
    });
  
    Object.defineProperty(window.screen, 'height', {
      value: screen.height,
      writable: true,
      enumerable: true,
      configurable: true
    });

    /**
     * webrtc
     */
    // ['RTCPeerConnection', 'mozRTCPeerConnection', 'webkitRTCPeerConnection'].forEach((item) => {
    //   Object.defineProperty(window, item, {
    //     value: null,
    //     writable: true,
    //     enumerable: true,
    //     configurable: true
    //   });
    // });
  }


  
 
});

console.log('in preloading');
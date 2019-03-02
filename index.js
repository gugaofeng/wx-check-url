
const axios = require('axios');
const fs = require("file-system");
const Util = require('./common/util');

class Main {

  /**
   * 微信公众号配置
   * appid
   * secret
   */
  // wxConf=null;

  constructor(wxConf = null, tokenFile = '') {
    this.wxConf = wxConf || {};
    this.tokenFile = tokenFile; // 存储accessToken 本地文件, 如果空 则不用本地存储
    this.accessToken = ''; // 调用微信接口参数accessToken
    this.isRunning = true; // 是否正在运行
    this.rows = [];// 要检测的数据 [ {url: 'http://www.inke.cn/index.html', id:1} ]
    this.curIdex = 0;  // 当前正在检测url 索引
  }

  async init(urls) {
    if (!Array.isArray(urls) || !urls[0].url) {
      throw '检测的数据格式不对';
    }
    this.rows = urls;
    try {
      if (!this.accessToken) {
        await this.getAccessToken();
      }
      console.log('循环开始====')
      await this.checkOne();
      console.log('rows:', this.rows);
      return this.rows;
    } catch (error) {
      console.log('XXXX error:', error.message)
    }
  }

  // 停止检测
  stop() {
    this.isRunning = false;

  }
  // 继续检测
  async reStart() {
    this.isRunning = true;
    await this.checkOne();
  }

  // 先判断本地文件有没有存储token，如果没有 接口获取
  async getAccessToken() {
    let token = this.getSavedToken();
    if (!token) {
      token = await this.createWxToken();
    }
    this.accessToken = token;
  }
  async checkOne() {
    if (!this.isRunning) {
      console.log('已经停止检测');
      return;
    }
    let cUrl =  this.rows[this.curIdex].url
    console.log('原始链接:', cUrl);
    let sUrl = await this.createShortUrl(cUrl);
    if (await this.requestUrl(sUrl)) {
      this.rows[this.curIdex].isForbid = 1;
    }
    if (this.rows.length - 1 <= this.curIdex) {
      console.log('end 检测结束 ======== \n')
      return;
    }
    await Util.delayTime(parseInt( Math.random()*2000));
    this.curIdex++;
    // 数组递归查询下一个
    await this.checkOne();
  }

  /**
   * 获取本地存储的token
   * 有60分钟过期时间
   */
  getSavedToken() {
    if (!this.tokenFile) {
      return;
    }
    // 本地文件获取
    const saveStr = Util.getFileContent(this.tokenFile);
    if (!saveStr) {
      return;
    }
    const arr = saveStr.split('@@');
    // 距离上次存储时间 间隔 小于 60分钟
    if ((new Date().getTime() - new Date(arr[0]).getTime() < 60 * 60 * 1000) && arr.length > 1) {
      return arr[1];
    } else {
      console.log('超过60分钟')
      return;
    }
  }

  /**
   *
   * 获取微信接口access_token
   * https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET
   * https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140183
   *
  */
  async createWxToken() {
    const { appid, secret } = this.wxConf;
    const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`;
    return await axios.get(url).then(res => {
      if (res.status !== 200) {
        console.error('get token api not 200');
        throw new Error('getTokenApi status is ' + res.status)
      }
      let data = res.data;
      if (!data.access_token || data.errcode) {
        throw new Error(JSON.stringify(data))
      }
      // 本地文件存储 access_token
      if (this.tokenFile) {
        const timeStr = Util.getFullTime();
        setFileContent(this.tokenFile, timeStr + '@@' + data.access_token);
      }
      return data.access_token;
    });
  }

  /**
 * 长链接转短链接
 * @param {URI}
 * 文档 https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1443433600
 * https://api.weixin.qq.com/cgi-bin/shorturl?access_token=ACCESS_TOKEN
 */
  async createShortUrl(longUrl) {
    const url = `https://api.weixin.qq.com/cgi-bin/shorturl?access_token=${this.accessToken}`;
    const postData = {
      action: 'long2short',
      long_url: longUrl
    }
    return await axios.post(url, postData).then(res => {
      if (res.status !== 200) {
        console.error('get token api not 200');
        throw new Error('createShortUrl status is ' + res.status)
        return;
      }
      let data = res.data;
      if (!data.short_url || data.errcode) {
        throw new Error(JSON.stringify(data))
      }
      return data.short_url;
    });
  }

  /**
   * 请求URL 根据返回结果判断是否被封
   */
  async requestUrl(url) {
    console.log('短链接：', url)
    return axios.get(url).then(res => {
      console.log('检测结果::')
      // console.log(res.request.connection._host); //res.request.connection._httpMessage.res.responseUrl
      const resHost = res.request.connection._host;
      if (/weixin110.qq.com/gi.test(resHost)) {
        console.log(res.request.connection._host);
        console.log('被微信封');
        return true;
      }
      console.log('正常')
    }).catch(error => {
      console.log('requestUrlCheck error: ', error)
    })
  }

}

class CheckUrl {
  constructor(opt) {
    this.instance = new Main(opt.wxConf, opt.tokenFile);
  }
  /**
   *
   * @param {Array} rows 带检测的数据
   *  [ {url:'http://qyunrh.4ak94fyh.cn/t.php?EV4icTd.css', id: 1} ]
   * return Array ,加一个 isForbid是否被封
   *  [ {url:'http://qyunrh.4ak94fyh.cn/t.php?EV4icTd.css', id: 1, isForbid: 1} ]
   */
  async init(rows) {
    return await this.instance.init(rows);
  }
  stop() {
    this.instance.stop();
  }
  restart() {
    this.instance.reStart();
  }
}


module.exports = CheckUrl;


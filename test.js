
/**
 * 根据微信api接口生成 短链接
 * cur 短链接 根据返回结果判断是否被封
 */

const Util = require('./common/util')
const CheckUrl = require('./index.js');


let testObj = new CheckUrl({
  wxConf: {
    appid: '微信公众号APPID',
    secret: '微信公众号secret'
  }
});

const rows = [
  { url: 'http://qyunrh.4ak94fyh.cn/t.php?EV4icTd.css', id: 1 },
  { url: 'http://qyunrh.ljvedu28.cn/t.php?EV4icTd.css', id: 2 },
  { url: 'http://qyunrh.52hjqy4l.cn/t.php?EV4icTd.css', id: 3 },
  { url: 'http://qyunrh.kd27ipsu.cn/t.php?EV4icTd.css', id: 4 }
];
testObj.init(rows);





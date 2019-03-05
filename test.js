
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
  { url: 'https://www.baidu.com/', id: 2 },
  { url: 'https://www.zidanduanxin.com', id: 4 }
];
testObj.init(rows);





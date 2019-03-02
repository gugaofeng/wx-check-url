/**
 * 工具函数
 * @author gugf
 * 20190302
 */


var fs = require("file-system");

class Util {

  /**
   * get当前时间格式化
   */
  static getFullTime() {
    const obj = new Date(time || Date());
    const year = obj.getFullYear();
    const month = ("0" + (obj.getMonth() + 1)).slice(-2);
    const date = ("0" + (obj.getDate())).slice(-2);
    const hour = ("0" + (obj.getHours())).slice(-2);
    const minute = ("0" + (obj.getMinutes())).slice(-2);
    const second = ("0" + (obj.getSeconds())).slice(-2);
    return `${year}-${month}-${date} ${hour}:${minute}:${second}`;
  }

  /**
   * 读取文件内容
   * @param {FIle Path`}  文件路径
   */
  static getFileContent(path) {
    try {
      const data = fs.readFileSync(path)
      return data.toString();
    } catch (error) {
      console.log(error.message);
      return
    }
  }

  /**
   * 写入文件内容
   * @param {String} 文件路径
   * @param {String} 内容
   * @param {Bolen}  是否同步执行 默认异步
   */
  static setFileContent(path, str, isSync) {
    if (isSync) {
      fs.writeFileSync(path, str);
      return;
    }
    fs.writeFile(path, str, function (res) {
    })

  }

  /**
   * 延时几毫秒
   * @param {Number} ms
   */
  static delayTime(ms) {
    return new Promise(function(resolve) {
      setTimeout(resolve, ms || 0)
    })
  }

}

module.exports = Util;


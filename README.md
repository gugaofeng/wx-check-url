# wx-check-url
检测H5页面是否微信封禁屏蔽


## 安装
`npm install wx-check-url --save`


## 使用
```

const wxCheckUrl = require('wx-check-url');

const CheckObj = new wxCheckUrl({
  wxConf: {
    appid: '${微信公众号APPID}',
    secret: '${微信公众号secret}'
  }
});

const rows = [
   { url: 'https://www.baidu.com/', id: 2 },
  { url: 'https://www.zidanduanxin.com', id: 4 }
];

CheckObj.init(rows);

// 根据返回数组中的属性 isForbid 判断是否被封

/**
// 返回值
  [
    { url: 'https://www.baidu.com/', id: 2 },   // 正常
    { url: 'https://www.zidanduanxin.com', id: 4, isForbid: 1 }   // 被封
  ]
**/

```
# node-imageviewurlreplace

## Installation

```
$ npm install imageviewurlreplace
```

## Usage

```javascript
var ivur = require("imageviewurlreplace");

ivur.on("error", function (error, res, body) {
    console.log(error);
});

ivur({uri: "http://ascii.jp/elem/000/000/686/686849/img.html"}, function (url, referer, res) {
    console.log(url); // http://ascii.jp/elem/000/000/686/686849/sv1_c_640x480.jpg
});

ivur("http://ascii.jp/elem/000/000/686/686849/img.html", function (url, referer, res) {
    console.log(url); // http://ascii.jp/elem/000/000/686/686849/sv1_c_640x480.jpg
});
```

## Copyright

Copyright (c) 2012 Kazuki Suda. See LICENSE.txt for further details.

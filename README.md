# node-imageviewurlreplace
[![Build Status](https://travis-ci.org/superbrothers/node-imageviewurlreplace.png?branch=master)](https://travis-ci.org/superbrothers/node-imageviewurlreplace)

## Installation

```
$ npm install imageviewurlreplace
```

## Usage

```javascript
var ivur = require("imageviewurlreplace");

ivur({uri: "http://ascii.jp/elem/000/000/686/686849/img.html"}, function (url, referer, res) {
  console.log(url); // http://ascii.jp/elem/000/000/686/686849/sv1_c_640x480.jpg
}).on("error", function (error) {
  console.log(error);
});

ivur("http://ascii.jp/elem/000/000/686/686849/img.html", function (url, referer, res) {
  console.log(url); // http://ascii.jp/elem/000/000/686/686849/sv1_c_640x480.jpg
});
```

## Copyright

Copyright (c) 2012 Kazuki Suda. See LICENSE for further details.

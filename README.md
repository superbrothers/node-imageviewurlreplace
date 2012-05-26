# node-imageviewurlreplace

## Installation

```
$ npm install imageviewurlreplace
```

## Usage

```javascript
var ivur = require("imageviewurlreplace");

ivur.timeout = 1000; // http request timeout (default: 1000 ms)

ivur.on("error", function (error, res, body) {
    console.log(error);
});

ivur.fetch("http://ascii.jp/elem/000/000/686/686849/img.html", function (url, res, referer) {
    console.log(url); // http://ascii.jp/elem/000/000/686/686849/sv1_c_640x480.jpg
});
```

## Copyright

Copyright (c) 2012 Kazuki Suda. See LICENSE.txt for further details.

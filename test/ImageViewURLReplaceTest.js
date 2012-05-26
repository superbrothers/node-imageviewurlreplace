var path = require("path")
  , ivur = require(path.join(__dirname, "..", "index.js"));

module.exports = {
    "EXTRACT Mode": {
      "単一の$EXTRACT": function (test) {
      ivur.fetch("http://ascii.jp/elem/000/000/686/686849/img.html", function (url, referer, res) {
        test.equal(url, "http://ascii.jp/elem/000/000/686/686849/sv1_c_640x480.jpg");
        test.done();
      });
    }
    , "複数の$EXTRACT": function (test) {
      ivur.fetch("http://www.vector.co.jp/magazine/softnews/120414/n1204141.html", function (url, referer, res) {
        test.equal(url, "http://www.vector.co.jp/magazine/softnews/120414/images/n12041411b.gif");
        test.done();
      });
    }
    , "リファラ付き": function (test) {
      ivur.fetch("http://hobby-c.rash.jp/igafioz/ref/1330986364242.htm", function (url, referer, res) {
        test.equal(url, "http://hobby-c.rash.jp/igafioz/src/1330986364242.jpg");
        test.done();
      });
    }
  }
  , "VIEWER Mode": {
    "正しく取得できる": function (test) {
      ivur.fetch("http://map.yahoo.co.jp/pl?type=scroll&lat=35.67832667&lon=139.77044378&sc=3&mode=map&pointer=on", function (url, referer, res) {
        test.equal(url, "http://img.map.yahoo.co.jp/ymap/mk_map?type=scroll&lat=35.67832667&lon=139.77044378&sc=3&mode=map&pointer=on");
        test.done();
      });
    }
  }
  , "DEFAULT Mode": {
    "正しく取得できる": function (test) {
      ivur.fetch("http://upload.wikimedia.org/wikipedia/en/f/fa/Google_Chrome_2011_computer_icon.svg", function (url, referer, res) {
        test.equal(url, "http://upload.wikimedia.org/wikipedia/en/thumb/f/fa/Google_Chrome_2011_computer_icon.svg/1000px-Google_Chrome_2011_computer_icon.svg.png");
        test.done();
      });
    }
  }
  , "NG": {
    "正しくNG判定できている": function (test) {
      ivur.fetch("http://ipatukouta.altervista.org/test.jpg", function (url, referer, res) {
        test.equal(url, null);
        test.done();
      });
    }
  }
  , "Error": {
    "http request timeout": function (test) {
      ivur.timeout = 1;
      ivur.on("error", function (error) {
        test.equal(error.code, "ETIMEDOUT");
        test.done();
      });
      ivur.fetch("http://ascii.jp/elem/000/000/686/686849/img.html", function () {});
    }
  }
};

var path = require("path")
  , ivur = require(path.join(__dirname, "..", "index.js"));

module.exports = {
    "EXTRACT Mode": {
    "単一の$EXTRACT": function (test) {
      ivur("http://ascii.jp/elem/000/000/686/686849/img.html", function (uri, referer, res) {
        test.equal(uri, "http://ascii.jp/elem/000/000/686/686849/sv1_c_640x480.jpg");
        test.done();
      });
    }
    , "jpg.toを正しく変換できる(Refererをnullで設定すると取得できない)": function (test) {
      ivur("http://アップル.jpg.to/", function (uri, referer, res) {
        test.ok(/^http:\/\//.test(uri));
        test.done();
      });
    }
    , "複数の$EXTRACT": function (test) {
      ivur("http://www.vector.co.jp/magazine/softnews/120414/n1204141.html", function (uri, referer, res) {
        test.equal(uri, "http://www.vector.co.jp/magazine/softnews/120414/images/n12041411b.gif");
        test.done();
      });
    }
    , "リファラ付き": function (test) {
      ivur("http://hobby-c.rash.jp/igafioz/ref/1330986364242.htm", function (uri, referer, res) {
        test.equal(uri, "http://hobby-c.rash.jp/igafioz/src/1330986364242.jpg");
        test.done();
      });
    }
  }
  , "VIEWER Mode": {
    "正しく取得できる": function (test) {
      ivur("http://map.yahoo.co.jp/pl?type=scroll&lat=35.67832667&lon=139.77044378&sc=3&mode=map&pointer=on", function (uri, referer, res) {
        test.equal(uri, "http://img.map.yahoo.co.jp/ymap/mk_map?type=scroll&lat=35.67832667&lon=139.77044378&sc=3&mode=map&pointer=on");
        test.done();
      });
    }
  }
  , "DEFAULT Mode": {
    "正しく取得できる": function (test) {
      ivur("http://upload.wikimedia.org/wikipedia/en/f/fa/Google_Chrome_2011_computer_icon.svg", function (uri, referer, res) {
        test.equal(uri, "http://upload.wikimedia.org/wikipedia/en/thumb/f/fa/Google_Chrome_2011_computer_icon.svg/1000px-Google_Chrome_2011_computer_icon.svg.png");
        test.done();
      });
    }
  }
  , "NG": {
    "正しくNG判定できている": function (test) {
      ivur("http://ipatukouta.altervista.org/test.jpg", function (uri, referer, res) {
        test.equal(uri, null);
        test.done();
      });
    }
  }
  , "Error": {
    "http request timeout": function (test) {
      ivur({uri: "http://ascii.jp/elem/000/000/686/686849/img.html", timeout: 1}, function () {}).on("error", function (error) {
        test.equal(error.code, "ETIMEDOUT");
        test.done();
      });
    }
    , "ルールに不正がある場合、error として emit する": function (test) {
      ivur("http://www.yahoo.co.jp/", function (uri, referer, res) {
      }).on("error", function (error) {
        test.done();
      });
    }
  }
  , "Bugs": {
    "バグの再現ケース": function (test) {
      ivur("http://www.pixiv.net/member_illust.php?mode=medium&illust_id=77777&test=bugs", function (uri, referer, res) {
        test.equal(uri, "http://img02.pixiv.net/img/akeno9ys/77777.jpg");
        test.done();
      });
    }
  }
};

var path = require("path")
  , Rule = require(path.join(__dirname, "..", "lib", "rule.js"));

module.exports = {
    "ScrapeURI が正しく取得できている": function (test) {
    var rule = new Rule({
        regexp: /http:\/\/(?:www\.)?pixiv\.net\/\w+\.php\?.*illust_id=(\d+)/i
      , replace: '$EXTRACT1$EXTRACT2'
      , referer: 'http://www.pixiv.net/member_illust.php?mode=medium&illust_id=$1'
      , mode: '$EXTRACT'
      , options: ['$EXTRACT', '"([^"]+$1)[^".]*(\\.(?:jpe?g|png|gif|bmp))']
    });
    test.ok(rule.match("http://www.pixiv.net/member_illust.php?mode=medium&illust_id=27610206&test=bugs"));
    test.equal(rule.getScrapeURI(), "http://www.pixiv.net/member_illust.php?mode=medium&illust_id=27610206");
    test.done();
  }
}
// vim: set fenc=utf-8 ts=2 sts=2 sw=2

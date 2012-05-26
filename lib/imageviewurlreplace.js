var path = require("path")
  , fs = require("fs")
  , EventEmitter = require("events").EventEmitter
  , request = require("request")
  , Rule = require(path.join(__dirname, "rule.js"))
  , datFiles = [path.join(__dirname, "..", "ImageViewURLReplace.dat")]
  , extRootDir = path.join(__dirname, "..", "external")
  ;

// コメントアウトを判定
function isCommentOut(line) {
  return line.match(/^('|;|\/)/) !== null;
}

// 拡張設定の探索
datFiles = fs.readdirSync(extRootDir).filter(function (file) {
  if (!fs.statSync(path.join(extRootDir, file)).isFile()) return;
  return (path.extname(file) === ".dat")
}).map(function (file) {
  return path.join(extRootDir, file);
}).concat(datFiles);

module.exports = (function () {
  var evm = new EventEmitter
    , rules = []
    , ivur;

  datFiles.forEach(function (datFile) {
    fs.readFileSync(datFile, "utf8").split("\n").forEach(function (line) {
      line = line.trim();

      if (line.length > 0 && !isCommentOut(line)) {
        try {
          var splits = line.split(/\t+/)
            , regexp = new RegExp(splits[0], "i");

          rules.push(new Rule({
              line: line
            , regexp: regexp
            , replace: splits[1]
            , referer: splits[2]
            , mode: splits[3]
            , options: splits.splice(3)
          }));
        } catch (e) {
          console.error(e);
        }
      }
    });
  });

  ivur = {
    // http request timeout(ms)
      timeout: 1000
    // events
    , on: function (event, listener) { evm.on(event, listener) }
    // fetch image URL
    , fetch: function (url, callback) {
      var rule, matches;
      for (var i = 0, len = rules.length; i < len; i++) {
        matches = rules[i].match(url);
        if (matches !== null) {
          rule = rules[i];
          break;
        }
      }

      if (typeof rule === "undefined" || (rule instanceof Rule && rule.isNg())) {
        callback(null, null);
        return;
      }

      if (rule.isExtractMode()) {
        request({
            uri: rule.getScrapeURL()
          , headers: {
            Referer: rule.getRefererURL()
          }
          , timeout: ivur.timeout
        }, function (error, response, body) {
          var matches
            , imageURL = null;

          if (error || response.statusCode !== 200) {
            evm.emit("error", error, response, body);
            return;
          }

          if (body !== null) {
            matches = rule.getHtmlRegExp().exec(body);
            if (matches !== null) {
              imageURL = rule.getReplace().replace(/\$EXTRACT(\d)?/g, function (str, p1) {
                return (typeof p1 === "undefined") ? matches[1] : matches[p1];
              });
            }
          }
          callback(imageURL, rule.getRefererURL(), response);
        });
      } else if (rule.isViewerMode() || rule.isDefaultMode()) {
        var imageURL = rule.getReplace();
        callback(imageURL, rule.getRefererURL(), null);
      } else {
        callback(null, null, null);
      }
    }
  };
  ivur.on("error", function () {});
  return ivur;
}());
// vim: set fenc=utf-8 ts=2 sts=2 sw=2

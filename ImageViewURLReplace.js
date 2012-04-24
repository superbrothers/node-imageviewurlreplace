var path = require("path")
  , fs = require("fs")
  , request = require("request")
  , datFile = path.join(__dirname, "ImageViewURLReplace.dat")
  ;

function Rule(args) {
  this.line = args.line;
  this.regexp = args.regexp;
  this.replace = args.replace;
  this.referer = args.referer;
  this.mode = args.mode;
  this.options = args.options;
}

Rule.prototype = {
    match: function (url) {
    var matches =  url.match(this.regexp);
    if (matches !== null) {
      this.url = url;
    }
    return matches;
  }
  , isExtractMode: function () {
    return /^\$EXTRACT/.test(this.mode);
  }
  , isCookieMode: function () {
    return this.mode === "$COOKIE";
  }
  , isViewerMode: function () {
    return this.mode === "$VIEWER";
  }
  , isDefaultMode: function () {
    return typeof this.mode === "undefined" || this.mode === null;
  }
  , isNg: function () {
    return this.replace === "おまんちん" || this.replace == null;
  }
  , getScrapeURL: function () {
    return this.url.replace(this.regexp, this.referer);
  }
  , getRefererURL: function () {
    var newSubStr = this.mode.replace(/^\$EXTRACT(?:=)?/, "");
    return (newSubStr.length === 0) ? null : this.url.replace(this.regexp, newSubStr);
  }
  , getReplace: function () {
    return this.url.replace(this.regexp, this.replace);
  }
  , getHtmlRegExp: function () {
    return new RegExp(this.url.replace(this.regexp, this.options[1]), "i");
  }
};

// コメントアウトを判定
function isCommentOut(line) {
  return line.match(/^('|;|\/)/) !== null;
}

module.exports = (function () {
  var rules = [];

  fs.readFileSync(datFile, "utf8").split("\n").forEach(function (line) {
    line = line.trim();

    if (line.length > 0 && !isCommentOut(line)) {
      var splits = line.split(/\t+/);

      rules.push(new Rule({
          line: line
        , regexp: new RegExp(splits[0], "i")
        , replace: splits[1]
        , referer: splits[2]
        , mode: splits[3]
        , options: splits.splice(3)
      }));
    }
  });

  return function imageViewURLReplace(url, callback) {
    var rule, matches;
    for (var i = 0, len = rules.length; i < len; i++) {
      matches = rules[i].match(url);
      if (matches !== null) {
        rule = rules[i];
        break;
      }
    }

    if (typeof rule === "undefined" || (rule instanceof Rule && rule.isNg())) {
      callback(null, null, null);
      return;
    }

    if (rule.isExtractMode()) {
      request({
        uri: rule.getScrapeURL(),
        headers: {
          Referer: rule.getRefererURL()
        },
        timeout: 3000
      }, function (error, response, body) {
        var matches
          , imageURL = null;

        if (body !== null) {
          matches = rule.getHtmlRegExp().exec(body);
          if (matches !== null) {
            imageURL = rule.getReplace().replace(/\$EXTRACT(\d)?/g, function (str, p1) {
              return (typeof p1 === "undefined") ? matches[1] : matches[p1];
            });
          }
        }
        callback(error, response, imageURL);
      });
    } else if (rule.isViewerMode() || rule.isDefaultMode()) {
      var imageURL = rule.getReplace();
      callback(null, null, imageURL);
    } else {
      callback(null, null, null);
    }
  };
}());

function Rule(args) {
  this.line = args.line;
  this.regexp = args.regexp;
  this.replace = args.replace;
  this.referer = args.referer;
  this.mode = args.mode;
  this.options = args.options;
}

Rule.prototype = {
    match: function (uri) {
    var matches =  uri.match(this.regexp);
    if (matches !== null) {
      this.uri = uri;
      this.matches = matches;
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
  , getScrapeURI: function () {
    return this.replaceBackreference(this.referer);
  }
  , getRefererURI: function () {
    if (this.isDefaultMode()) return null;
    if (this.isExtractMode()) return this.getScrapeURI();
    var nstr = this.mode.replace(/^\$EXTRACT(?:=)?/, "");
    if (nstr.length === 0) return null;
    return this.replaceBackreference(nstr);
  }
  , getReplace: function () {
    return this.replaceBackreference(this.replace);
  }
  , getHtmlRegExp: function () {
    return new RegExp(this.replaceBackreference(this.options[1]), "i");
  }
  , replaceBackreference: function (replacement) {
    var matches = this.matches;
    return replacement.replace(/\$(\d|&)/g, function (str, p1) {
      var p = (p1 === "&") ? 0 : p1;
      if (matches[p] === undefined) {
        throw new SyntaxError("backreference to undefined group " + p);
      }
      return matches[p];
    });
  }
};
module.exports = Rule;
// vim: set fenc=utf-8 ts=2 sts=2 sw=2

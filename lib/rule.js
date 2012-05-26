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
    if (this.isDefaultMode()) return null;
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
module.exports = Rule;
// vim: set fenc=utf-8 ts=2 sts=2 sw=2

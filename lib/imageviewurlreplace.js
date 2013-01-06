/*jslint node: true, nomen: true, stupid: true, maxerr: 50, indent: 4 */

'use strict';

var path = require("path"),
    fs = require("fs"),
    util = require("util"),
    events = require("events"),
    request = require("request"),
    Rule = require(path.join(__dirname, "rule.js")),
    datFiles = [path.join(__dirname, "..", "ImageViewURLReplace.dat")],
    extRootDir = path.join(__dirname, "..", "external"),
    rules = [];

// コメントアウトを判定
function isCommentOut(line) {
    return line.match(/^('|;|\/)/) !== null;
}

// 拡張設定の探索
datFiles = fs.readdirSync(extRootDir).filter(function (file) {
    if (!fs.statSync(path.join(extRootDir, file)).isFile()) {
        return;
    }
    return (path.extname(file) === ".dat");
}).map(function (file) {
    return path.join(extRootDir, file);
}).concat(datFiles);

datFiles.forEach(function (datFile) {
    fs.readFileSync(datFile, "utf8").split("\n").forEach(function (line) {
        var splits, regexp;

        line = line.trim();

        if (line.length > 0 && !isCommentOut(line)) {
            try {
                splits = line.split(/\t+/);
                regexp = new RegExp(splits[0], "i");

                rules.push(new Rule({
                    line: line,
                    regexp: regexp,
                    replace: splits[1],
                    referer: splits[2],
                    mode: splits[3],
                    options: splits.splice(3)
                }));
            } catch (e) {
                console.error(e);
            }
        }
    });
});

function ImageViewURLReplace() {
    events.EventEmitter.call(this);
}
util.inherits(ImageViewURLReplace, events.EventEmitter);
ImageViewURLReplace.prototype.ivur = function (uri, options, callback) {
    if (typeof uri === "undefined") {
        throw new Error("undefined is not a valid uri or options object.");
    }
    if (typeof options === "function" && !callback) {
        callback = options;
    }
    if (options && typeof options === "object") {
        options.uri = uri;
    } else if (typeof uri === "string") {
        options = {uri: uri};
    } else {
        options = uri;
    }
    if (typeof callback !== "function") {
        callback = function () {};
    }

    uri = options.uri;
    var rule,
        matches,
        self = this,
        debug = options.debug,
        i,
        len;

    // options はそのまま request で利用するため、
    // 不要なオプションを事前に削除する
    delete options.debug;

    for (i = 0, len = rules.length; i < len; i = i + 1) {
        matches = rules[i].match(uri);
        if (matches !== null) {
            rule = rules[i];
            break;
        }
    }

    if (typeof rule === "undefined" || (rule instanceof Rule && rule.isNg())) {
        callback(null, null, null);
        return;
    }

    try {
        if (rule.isExtractMode()) {
            options.uri = rule.getScrapeURI();
            if (rule.getRefererURI()) {
                if (typeof options.headers !== "object") {
                    options.headers = {};
                }
                options.headers.Referer = rule.getRefererURI();
            }

            if (debug) {
                console.log(options);
            }
            request(options, function (error, response, body) {
                var matches, uri;
                if (error || response.statusCode !== 200) {
                    self.emit("error", error, response, body);
                    return;
                }

                if (body !== null) {
                    matches = rule.getHtmlRegExp().exec(body);
                    if (matches !== null) {
                        uri = rule.getReplace().replace(/\$EXTRACT(\d)?/g, function (str, p1) {
                            return (typeof p1 === "undefined") ? matches[1] : matches[p1];
                        });
                    }
                }
                callback(uri, rule.getRefererURI(), response);
            });
        } else if (rule.isViewerMode() || rule.isDefaultMode()) {
            callback(rule.getReplace(), rule.getRefererURI(), null);
        } else {
            callback(null, null, null);
        }
    } catch (e) {
        if (debug) {
            console.error(rule);
        }
        self.emit("error", e, null, null);
    }
};

function ivur(uri, options, callback) {
    var i = new ImageViewURLReplace();
    function _ivur() {
        i.ivur(uri, options, callback);
    }
    process.nextTick(_ivur);
    return i;
}

module.exports = ivur;

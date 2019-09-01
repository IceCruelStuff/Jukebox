"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TerminalTextFormat_1 = require("./TerminalTextFormat");
exports.ESCAPE = "\u00A7"; // Sadly on constant i cannot do TextFormat.ESCAPE :/
exports.TextFormat = {
    BLACK: exports.ESCAPE + "0",
    DARK_BLUE: exports.ESCAPE + "1",
    DARK_GREEN: exports.ESCAPE + "2",
    DARK_AQUA: exports.ESCAPE + "3",
    DARK_RED: exports.ESCAPE + "4",
    DARK_PURPLE: exports.ESCAPE + "5",
    GOLD: exports.ESCAPE + "6",
    GRAY: exports.ESCAPE + "7",
    DARK_GARY: exports.ESCAPE + "8",
    BLUE: exports.ESCAPE + "9",
    GREEN: exports.ESCAPE + "a",
    AQUA: exports.ESCAPE + "b",
    RED: exports.ESCAPE + "c",
    LIGHT_PURPLE: exports.ESCAPE + "d",
    YELLOW: exports.ESCAPE + "e",
    WHITE: exports.ESCAPE + "f",
    OBFUSCATED: exports.ESCAPE + "k",
    BOLD: exports.ESCAPE + "l",
    STRIKETHROUGH: exports.ESCAPE + "m",
    UNDERLINE: exports.ESCAPE + "n",
    ITALIC: exports.ESCAPE + "o",
    RESET: exports.ESCAPE + "r",
    tokenize: function (str) {
        return str.split(new RegExp("(" + exports.ESCAPE + "[0123456789abcdefklmnor])")).filter(v => v !== "");
    },
    clean: function (str, removeFormat = true) {
        if (removeFormat) {
            return str.toString().replace(RegExp(exports.ESCAPE + "[0123456789abcdefklmnor]", "g"), "").replace(/\x1b[\\(\\][[0-9;\\[\\(]+[Bm]/g, "").replace(new RegExp(exports.ESCAPE, "g"), "");
        }
        return str.toString().replace(/\x1b[\\(\\][[0-9;\\[\\(]+[Bm]/g, "").replace(/\x1b/g, "");
    },
    toTerminal: function (str) {
        str = exports.TextFormat.tokenize(str);
        str.forEach((v, k) => {
            switch (v) {
                case exports.TextFormat.BLACK:
                    str[k] = TerminalTextFormat_1.TerminalTextFormat.BLACK;
                    break;
            }
        });
        return str.join("");
    }
};
//# sourceMappingURL=TextFormat.js.map
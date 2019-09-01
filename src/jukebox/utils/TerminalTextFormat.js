"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ESCAPE = "\u001b";
exports.TerminalTextFormat = {
    BLACK: exports.ESCAPE + "[30m",
    DARK_BLUE: exports.ESCAPE + "[34m",
    DARK_GREEN: exports.ESCAPE + "[32m",
    DARK_AQUA: exports.ESCAPE + "[36m",
    DARK_RED: exports.ESCAPE + "[31m",
    DARK_PURPLE: exports.ESCAPE + "[35m",
    GOLD: exports.ESCAPE + "[33m",
    GRAY: exports.ESCAPE + "[37m",
    DARK_GARY: exports.ESCAPE + "[30;1m",
    BLUE: exports.ESCAPE + "[34;1m",
    GREEN: exports.ESCAPE + "[32;1m",
    AQUA: exports.ESCAPE + "[36;1m",
    RED: exports.ESCAPE + "[31;1m",
    LIGHT_PURPLE: exports.ESCAPE + "[35;1m",
    YELLOW: exports.ESCAPE + "[33;1m",
    WHITE: exports.ESCAPE + "[37;1m",
    OBFUSCATED: exports.ESCAPE + "[47m",
    BOLD: exports.ESCAPE + "[1m",
    STRIKETHROUGH: exports.ESCAPE + "[9m",
    UNDERLINE: exports.ESCAPE + "[4m",
    ITALIC: exports.ESCAPE + "[3m",
    RESET: exports.ESCAPE + "[0m",
    clean: function (message) {
        return message.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
    }
};
//# sourceMappingURL=TerminalTextFormat.js.map
export const ESCAPE = "\u001b";

export const TerminalTextFormat = {
    BLACK: ESCAPE + "[30m",
    DARK_BLUE: ESCAPE + "[34m",
    DARK_GREEN: ESCAPE + "[32m",
    DARK_AQUA: ESCAPE + "[36m",
    DARK_RED: ESCAPE + "[31m",
    DARK_PURPLE: ESCAPE + "[35m",
    GOLD: ESCAPE + "[33m",
    GRAY: ESCAPE + "[37m",
    DARK_GARY: ESCAPE + "[30;1m",
    BLUE: ESCAPE + "[34;1m",
    GREEN: ESCAPE + "[32;1m",
    AQUA: ESCAPE + "[36;1m",
    RED: ESCAPE + "[31;1m",
    LIGHT_PURPLE: ESCAPE + "[35;1m",
    YELLOW: ESCAPE + "[33;1m",
    WHITE: ESCAPE + "[37;1m",

    OBFUSCATED: ESCAPE + "[47m",
    BOLD: ESCAPE + "[1m",
    STRIKETHROUGH: ESCAPE + "[9m",
    UNDERLINE: ESCAPE + "[4m",
    ITALIC: ESCAPE + "[3m",
    RESET: ESCAPE + "[0m",

    clean: function (message: string) {
        return message.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
    }
};
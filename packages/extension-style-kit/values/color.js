import { Color as ExtensionColor } from "@zeplin/extension-model";

function toHex(num) {
    var hexNum = Math.trunc(num + (num / 255));
    hexNum = Math.max(0, Math.min(hexNum, 255));
    return (hexNum < 16 ? "0" : "") + hexNum.toString(16); // eslint-disable-line no-magic-numbers
}

function toHexString(color, prefix) {
    var hexCode = color.hexBase();

    if (color.a < 1) {
        var hexA = toHex(color.a * 255);

        hexCode = prefix ? (hexA + hexCode) : (hexCode + hexA);
    }

    return `#${hexCode}`;
}

function toRGBAString(color) {
    var alphaFormatter = new Intl.NumberFormat("en-US", {
        useGrouping: false,
        maximumFractionDigits: 2
    });

    var rgb = `${Math.round(color.r)}, ${
        Math.round(color.g)}, ${
        Math.round(color.b)}`;

    var rgbStr = color.a < 1
        ? `rgba(${rgb}, ${alphaFormatter.format(color.a)}`
        : `rgb(${rgb}`;

    return `${rgbStr})`;
}

/* eslint-disable no-magic-numbers */
function toHSLAString(color) {
    var alphaFormatter = new Intl.NumberFormat("en-US", {
        useGrouping: false,
        maximumFractionDigits: 2
    });

    var hslColor = color.toHSL();
    var hsl = `${Math.round(hslColor.h * 360)}, ${
        Math.round(hslColor.s * 100)}%, ${
        Math.round(hslColor.l * 100)}%`;

    var hslStr = color.a < 1
        ? `hsla(${hsl}, ${alphaFormatter.format(color.a)}`
        : `hsl(${hsl}`;

    return `${hslStr})`;
}
/* eslint-enable no-magic-numbers */

function getColorStringByFormat(color, colorFormat) {
    if (!("r" in color && "g" in color && "b" in color && "a" in color)) {
        return;
    }

    switch (colorFormat) {
        case "hex":
            return toHexString(color);

        case "rgb":
            return toRGBAString(color);

        case "hsl":
            return toHSLAString(color);

        case "default":
        default:
            return color.a < 1 ? toRGBAString(color) : toHexString(color);
    }
}

class Color {
    constructor(colorObject) {
        this.object = colorObject;
    }

    static fromRGBA({ r, g, b, a = 1 }) {
        return new Color(new ExtensionColor({ r, g, b, a }));
    }

    equals(other) {
        return this.object.equals(other.object);
    }

    toGradient({ colorFormat }) {
        const colorCSS = this.toStyleValue({ colorFormat });

        return `linear-gradient(${colorCSS}, ${colorCSS})`;
    }

    toStyleValue({ colorFormat }, variables) {
        const value = getColorStringByFormat(this.object, colorFormat);

        if (variables && value in variables) {
            return variables[value];
        }

        return value;
    }
}

export default Color;
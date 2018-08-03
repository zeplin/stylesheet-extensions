import { Color as ExtensionColor } from "@zeplin/extension-model";

import Gradient from "./gradient";

const alphaFormatter = new Intl.NumberFormat("en-US", {
    useGrouping: false,
    maximumFractionDigits: 2
});

function toHex(num) {
    let hexNum = Math.trunc(num + (num / 255));
    hexNum = Math.max(0, Math.min(hexNum, 255));

    return (hexNum < 16 ? "0" : "") + hexNum.toString(16);
}

function toHexString(color) {
    let hexCode = color.hexBase();

    if (color.a < 1) {
        hexCode += toHex(color.a * 255);
    }

    return `#${hexCode}`;
}

function toRGBAString(color) {
    const rgb = `${Math.round(color.r)}, ${Math.round(color.g)}, ${Math.round(color.b)}`;

    return color.a < 1
        ? `rgba(${rgb}, ${alphaFormatter.format(color.a)})`
        : `rgb(${rgb})`;
}

function toHSLString(color) {
    const hslColor = color.toHSL();
    const hsl = `${Math.round(hslColor.h * 360)}, ${Math.round(hslColor.s * 100)}%, ${Math.round(hslColor.l * 100)}%`;

    return color.a < 1
        ? `hsla(${hsl}, ${alphaFormatter.format(color.a)})`
        : `hsl(${hsl})`;
}

function getColorStringByFormat(color, colorFormat) {
    if (!("r" in color && "g" in color && "b" in color && "a" in color)) {
        return "";
    }

    switch (colorFormat) {
        case "hex":
            return toHexString(color);

        case "rgb":
            return toRGBAString(color);

        case "hsl":
            return toHSLString(color);

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

    toGradient() {
        const { r, g, b, a } = this.object;

        return Gradient.fromRGBA({ r, g, b, a });
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
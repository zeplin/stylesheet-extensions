import { Color as ExtensionColor } from "@zeplin/extension-model";

import Gradient from "./gradient";

const MAX_RGB_VALUE = 255;
const MAX_PERCENT = 100;
const MAX_ANGLE = 360;
const HEX_BASE = 16;

const alphaFormatter = new Intl.NumberFormat("en-US", {
    useGrouping: false,
    maximumFractionDigits: 2
});

function toHex(num) {
    let hexNum = Math.trunc(num + (num / MAX_RGB_VALUE));
    hexNum = Math.max(0, Math.min(hexNum, MAX_RGB_VALUE));

    return (hexNum < HEX_BASE ? "0" : "") + hexNum.toString(HEX_BASE);
}

function toHexString(color) {
    let hexCode = color.hexBase();

    if (color.a < 1) {
        hexCode += toHex(color.a * MAX_RGB_VALUE);
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
    const hsl = `${Math.round(hslColor.h * MAX_ANGLE)}, ${Math.round(hslColor.s * MAX_PERCENT)}%, ${Math.round(hslColor.l * MAX_PERCENT)}%`;

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

    valueOf() {
        const { r, g, b, a } = this.object;

        return `color::r:${r}:g:${g}:b:${b}:a:${a}`;
    }

    equals(other) {
        return this.object.equals(other.object);
    }

    toGradient() {
        const { r, g, b, a } = this.object;

        return Gradient.fromRGBA({ r, g, b, a });
    }

    toStyleValue({ colorFormat }, variables) {
        const value = this.valueOf();

        if (variables && value in variables) {
            return variables[value];
        }

        return getColorStringByFormat(this.object, colorFormat);
    }
}

export default Color;
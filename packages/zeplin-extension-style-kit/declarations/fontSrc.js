import { STYLE_PROPS } from "../constants";

const FORMATS = [{
    format: "woff2",
    ext: "woff2"
}, {
    format: "woff",
    ext: "woff"
}, {
    format: "truetype",
    ext: "ttf"
}];

class FontSrc {
    constructor(fontFace) {
        this.fontFace = fontFace;
    }

    static get DEFAULT_VALUE() {
        return "";
    }

    get name() {
        return STYLE_PROPS.FONT_SRC;
    }

    equals(other) {
        return this.fontFace === other.fontFace;
    }

    hasDefaultValue() {
        return this.fontFace === FontSrc.DEFAULT_VALUE;
    }

    getValue() {
        if (this.hasDefaultValue()) {
            return FontSrc.DEFAULT_VALUE;
        }

        const local = `local(${this.fontFace})`;
        const external = FORMATS.map(({ ext, format }) => `url(/path/to/${this.fontFace}.${ext}) format("${format}")`).join(", ");

        return `${local}, ${external}`;
    }
}

export default FontSrc;

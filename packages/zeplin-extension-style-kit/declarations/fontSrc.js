import { STYLE_PROPS } from "../constants";

const INDENTATION = "  ";

const VARIABLE_FORMAT = {
    format: "woff2-variations",
    ext: "woff2"
};

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
    constructor(fontFace, variable = false) {
        this.fontFace = fontFace;
        this.variable = variable;
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

        const joiner = `,\n${INDENTATION.repeat(2)}`;
        const sources = [`local(${this.fontFace})`];

        if (this.variable) {
            sources.push(`url(/path/to/${this.fontFace}.${VARIABLE_FORMAT.ext}) format("${VARIABLE_FORMAT.format}")`);
        } else {
            sources.push(...FORMATS.map(({ ext, format }) => `url(/path/to/${this.fontFace}.${ext}) format("${format}")`));
        }

        return sources.join(joiner);
    }
}

export default FontSrc;

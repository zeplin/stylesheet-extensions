import { STYLE_PROPS } from "../constants";
import { StyleDeclaration } from "../common";

const INDENTATION = "  ";

interface FontFormat {
    format: string;
    ext: string;
}

const VARIABLE_FORMAT: FontFormat = {
    format: "woff2-variations",
    ext: "woff2"
};

const FORMATS: FontFormat[] = [
    {
        format: "woff2",
        ext: "woff2"
    },
    {
        format: "woff",
        ext: "woff"
    },
    {
        format: "truetype",
        ext: "ttf"
    }
];

export class FontSrc implements StyleDeclaration {
    private fontFace: string;
    private variable: boolean;

    constructor(fontFace: string, variable: boolean = false) {
        this.fontFace = fontFace;
        this.variable = variable;
    }

    static get DEFAULT_VALUE(): string {
        return "";
    }

    get name(): string {
        return STYLE_PROPS.FONT_SRC;
    }

    equals(other: FontSrc): boolean {
        return this.fontFace === other.fontFace;
    }

    hasDefaultValue() {
        return this.fontFace === FontSrc.DEFAULT_VALUE;
    }

    getValue(): string {
        if (this.hasDefaultValue()) {
            return FontSrc.DEFAULT_VALUE;
        }

        const joiner = `,\n${INDENTATION.repeat(2)}`;
        const sources = [`local(${this.fontFace})`];

        if (this.variable) {
            sources.push(`url(/path/to/${this.fontFace}.${VARIABLE_FORMAT.ext}) format("${VARIABLE_FORMAT.format}")`);
        } else {
            sources.push(...FORMATS.map(({
                                             ext,
                                             format
                                         }) => `url(/path/to/${this.fontFace}.${ext}) format("${format}")`));
        }

        return sources.join(joiner);
    }
}

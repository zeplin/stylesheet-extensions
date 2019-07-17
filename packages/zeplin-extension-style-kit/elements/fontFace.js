import FontFamily from "../declarations/fontFamily";
import FontStyle from "../declarations/fontStyle";
import FontStretch from "../declarations/fontStretch";
import FontWeight from "../declarations/fontWeight";
import AtRule from "../atRule";
import FontSrc from "../declarations/fontSrc";

const FONT_STYLE_PRECEDENCE = Object.freeze({
    normal: 2,
    italic: 1,
    oblique: 0
});

class FontFace {
    constructor(fontObject) {
        this.font = fontObject;

        this.declarations = this.collectDeclarations();
    }

    static comparator(prev, cur) {
        // Sort font families alphabetically
        if (prev.fontFamily < cur.fontFamily) {
            return -1;
        }

        if (prev.fontFamily > cur.fontFamily) {
            return 1;
        }

        // Then sort by weight
        if (prev.fontWeight !== cur.fontWeight) {
            return prev.fontWeight - cur.fontWeight;
        }

        // Then sort by style
        if (prev.fontStyle !== cur.fontStyle) {
            return FONT_STYLE_PRECEDENCE[prev.fontStyle] - FONT_STYLE_PRECEDENCE[cur.fontStyle];
        }

        return 1;
    }

    collectDeclarations() {
        const { font } = this;

        const declarations = [
            new FontFamily(font.fontFamily),
            new FontSrc(font.fontFace)
        ];

        declarations.push(new FontWeight(font.fontWeight || FontWeight.DEFAULT_VALUE));
        declarations.push(new FontStyle(font.fontStyle || FontStyle.DEFAULT_VALUE));
        declarations.push(new FontStretch(font.fontStretch || FontStretch.DEFAULT_VALUE));

        return declarations;
    }

    get style() {
        return new AtRule(AtRule.Rule.FONT_FACE, this.declarations);
    }
}

export default FontFace;

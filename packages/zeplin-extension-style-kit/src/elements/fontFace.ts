import { FontFamily } from "../declarations/fontFamily";
import { FontStyle, FontStyleValue } from "../declarations/fontStyle";
import { FontStretch, StretchKeyword } from "../declarations/fontStretch";
import { FontWeight } from "../declarations/fontWeight";
import { AtRule } from "../atRule";
import { FontSrc } from "../declarations/fontSrc";
import { StyleDeclaration } from "../common";
import { TextStyle } from "@zeplin/extension-model";

const FONT_STYLE_PRECEDENCE: Record<string, number> = {
    normal: 2,
    italic: 1,
    oblique: 0
} as const;

export class FontFace {
    font: TextStyle;
    private readonly declarations: StyleDeclaration[];

    constructor(textStyle: TextStyle) {
        this.font = textStyle;
        this.declarations = this.collectDeclarations();
    }

    static comparator(prev: FontFace, cur: FontFace): number {
        // Sort font families alphabetically
        if (prev.font.fontFamily < cur.font.fontFamily) {
            return -1;
        }

        if (prev.font.fontFamily > cur.font.fontFamily) {
            return 1;
        }

        // Then by font weight (ascending)
        if (prev.font.fontWeight < cur.font.fontWeight) {
            return -1;
        }

        if (prev.font.fontWeight > cur.font.fontWeight) {
            return 1;
        }

        // Finally by font style precedence
        const prevPrecedence = FONT_STYLE_PRECEDENCE[prev.font.fontStyle] || 0;
        const curPrecedence = FONT_STYLE_PRECEDENCE[cur.font.fontStyle] || 0;

        return curPrecedence - prevPrecedence;
    }

    private collectDeclarations(): StyleDeclaration[] {
        const { font } = this;

        const variable = "fontVariationSettings" in font;

        const declarations: StyleDeclaration[] = [
            new FontFamily(font.fontFamily),
            new FontSrc(font.fontFace, variable)
        ];

        if (!variable) {
            declarations.push(
                new FontWeight(font.fontWeight),
                new FontStyle(font.fontStyle as FontStyleValue),
                new FontStretch(font.fontStretch as StretchKeyword)
            );
        }


        return declarations;
    }

    get style() {
        return new AtRule(AtRule.Rule.FONT_FACE, this.declarations);
    }
}

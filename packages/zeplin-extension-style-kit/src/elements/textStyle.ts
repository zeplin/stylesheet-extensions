import { Length } from "../values/length.js";
import { Color } from "../values/color.js";
import { FontFamily } from "../declarations/fontFamily.js";
import { FontSize } from "../declarations/fontSize.js";
import { FontStyle, FontStyleValue } from "../declarations/fontStyle.js";
import { FontStretch, StretchKeyword } from "../declarations/fontStretch.js";
import { FontWeight } from "../declarations/fontWeight.js";
import { FontVariationSettings } from "../declarations/fontVariationSettings.js";
import { FontColor } from "../declarations/fontColor.js";
import { TextAlign } from "../declarations/textAlign.js";
import { LineHeight } from "../declarations/lineHeight.js";
import { LetterSpacing } from "../declarations/letterSpacing.js";
import { RuleSet } from "../ruleSet.js";
import { selectorize } from "../utils.js";
import { StyleDeclaration } from "../common.js";
import { TextStyle as ExtensionTextStyle } from "@zeplin/extension-model";

// Reference: https://drafts.csswg.org/css-fonts-4/#valdef-font-style-oblique-angle
const DEFAULT_OBLIQUE_ANGLE = 14;

const useRemUnitForFont = ({ useForFontSizes }: { useForFontSizes: boolean }): boolean => useForFontSizes;

export class TextStyle {
    textStyle: ExtensionTextStyle;
    declarations: StyleDeclaration[];

    constructor(textStyle: ExtensionTextStyle) {
        this.textStyle = textStyle;
        this.declarations = this.collectDeclarations();
    }

    private collectDeclarations(): StyleDeclaration[] {
        const fontVariationSettings = this.getFontVariationSettings();
        const fontColor = this.getFontColor();
        const textAlign = this.getTextAlign();

        const declarations: StyleDeclaration[] = [
            this.getFontFamily(),
            this.getFontSize(),
            this.getFontWeight(),
            this.getFontStretch(),
            this.getFontStyle(),
            ...(fontVariationSettings ? [fontVariationSettings] : []),
            this.getLineHeight(),
            this.getLetterSpacing(),
            ...(textAlign ? [textAlign] : []),
            ...(fontColor ? [fontColor] : [])
        ];

        return declarations;
    }

    private getFontFamily(): FontFamily {
        return new FontFamily(this.textStyle.fontFamily);
    }

    private getFontSize(): FontSize {
        return new FontSize(new Length(this.textStyle.fontSize, { useRemUnit: useRemUnitForFont }));
    }

    private getFontStyle(): FontStyle {
        let style = this.textStyle.fontStyle;
        let angle: number | undefined;

        // Handle oblique with angle (e.g., "oblique 10deg")
        if (style.startsWith("oblique")) {
            const match = style.match(/(-?\d+)deg/);
            if (match) {
                angle = parseInt(match[1], 10);
                if (angle !== DEFAULT_OBLIQUE_ANGLE) {
                    style = `oblique ${angle}deg`;
                }
            }
        }

        return new FontStyle(style as FontStyleValue);
    }

    private getFontWeight(): FontWeight {
        return new FontWeight(this.textStyle.fontWeight);
    }

    private getFontStretch(): FontStretch {
        return new FontStretch(this.textStyle.fontStretch as StretchKeyword);
    }

    private getFontVariationSettings(): FontVariationSettings | null {
        return this.textStyle.fontVariationSettings ? new FontVariationSettings(this.textStyle.fontVariationSettings) : null;
    }

    private getFontColor(): FontColor | null {
        return this.textStyle.color ? new FontColor(new Color(this.textStyle.color)) : null;
    }

    private getTextAlign(): TextAlign | null {
        return this.textStyle.textAlign ? new TextAlign(this.textStyle.textAlign) : null;
    }

    private getLineHeight(): LineHeight {
        return new LineHeight(this.textStyle.lineHeight || LineHeight.DEFAULT_VALUE, this.textStyle.fontSize);
    }

    private getLetterSpacing(): LetterSpacing {
        return new LetterSpacing(this.textStyle.letterSpacing || LetterSpacing.DEFAULT_VALUE);
    }

    get style(): RuleSet {
        return new RuleSet(selectorize(this.textStyle.name), this.declarations);
    }
}

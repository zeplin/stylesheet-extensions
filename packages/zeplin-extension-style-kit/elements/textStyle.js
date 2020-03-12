import Length from "../values/length";
import Color from "../values/color";
import FontFamily from "../declarations/fontFamily";
import FontSize from "../declarations/fontSize";
import FontStyle from "../declarations/fontStyle";
import FontStretch from "../declarations/fontStretch";
import FontWeight from "../declarations/fontWeight";
import FontVariationSettings from "../declarations/fontVariationSettings";
import FontColor from "../declarations/fontColor";
import TextAlign from "../declarations/textAlign";
import LineHeight from "../declarations/lineHeight";
import LetterSpacing from "../declarations/letterSpacing";
import RuleSet from "../ruleSet";
import { selectorize } from "../utils";

// Optical sizing is a registered axis too, but its value is utilized in FontVariationSettings
const REGISTERED_AXES = Object.freeze({
    WEIGHT: "wght",
    WIDTH: "wdth",
    SLANT: "slnt",
    ITALIC: "ital"
});

// Reference: https://drafts.csswg.org/css-fonts-4/#valdef-font-style-oblique-angle
const DEFAULT_OBLIQUE_ANGLE = 14;

const useRemUnitForFont = ({ useForFontSizes }) => useForFontSizes;

class TextStyle {
    constructor(textStyleObject) {
        this.font = textStyleObject;

        this.declarations = this.collectDeclarations();
    }

    // eslint-disable-next-line complexity
    collectDeclarations() {
        const { font } = this;

        let fontWeight;
        let fontStretch;
        let fontStyle;
        let fontVariationSettings;

        if (font.fontVariationSettings) {
            fontWeight = font.fontVariationSettings[REGISTERED_AXES.WEIGHT];
            fontStretch = font.fontVariationSettings[REGISTERED_AXES.WIDTH];

            if (REGISTERED_AXES.SLANT in font.fontVariationSettings) {
                const angle = font.fontVariationSettings[REGISTERED_AXES.SLANT] === DEFAULT_OBLIQUE_ANGLE
                    ? ""
                    : ` ${font.fontVariationSettings[REGISTERED_AXES.SLANT]}deg`;

                fontStyle = `oblique${angle}`;
            } else if (font.fontVariationSettings[REGISTERED_AXES.ITALIC]) {
                fontStyle = "italic";
            }

            const registeredAxisNames = Object.values(REGISTERED_AXES);
            fontVariationSettings = Object.fromEntries(
                Object.entries(font.fontVariationSettings)
                    .filter(([axisName]) => !registeredAxisNames.includes(axisName))
            );
        } else {
            fontWeight = font.fontWeight;
            fontStretch = font.fontStretch;
            fontStyle = font.fontStyle;
        }

        const declarations = [
            new FontFamily(font.fontFamily),
            new FontSize(new Length(font.fontSize, { useRemUnit: useRemUnitForFont })),
            new FontWeight(fontWeight),
            new FontStretch(fontStretch),
            new FontStyle(fontStyle)
        ];

        if (fontVariationSettings) {
            declarations.push(new FontVariationSettings(fontVariationSettings));
        }

        declarations.push(new LineHeight(font.lineHeight || LineHeight.DEFAULT_VALUE, font.fontSize));
        declarations.push(new LetterSpacing(font.letterSpacing || LetterSpacing.DEFAULT_VALUE));

        if ("textAlign" in font && font.textAlign) {
            declarations.push(new TextAlign(font.textAlign));
        }

        if ("color" in font) {
            declarations.push(new FontColor(new Color(font.color)));
        }

        return declarations;
    }

    get style() {
        return new RuleSet(selectorize(this.font.name), this.declarations);
    }
}

export default TextStyle;

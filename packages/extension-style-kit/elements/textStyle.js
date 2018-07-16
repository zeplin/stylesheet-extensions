import Length from "../values/length";
import Color from "../values/color";
import FontFamily from "../props/fontFamily";
import FontSize from "../props/fontSize";
import FontStyle from "../props/fontStyle";
import FontStretch from "../props/fontStretch";
import FontWeight from "../props/fontWeight";
import FontColor from "../props/fontColor";
import TextAlign from "../props/textAlign";
import LineHeight from "../props/lineHeight";
import LetterSpacing from "../props/letterSpacing";
import RuleSet from "../ruleSet";
import { selectorize } from "../utils";

class TextStyle {
    constructor(textStyleObject, { showDefaultValues } = {}) {
        this.font = textStyleObject;
        this.showDefaultValues = showDefaultValues;

        this.props = this.collectProps();
    }

    collectProps() {
        const { font, showDefaultValues } = this;
        let props = [
            new FontFamily(font.fontFamily),
            new FontSize(new Length(font.fontSize))
        ];

        if (font.fontWeight) {
            const fontWeight = new FontWeight(font.fontWeight);

            if (!fontWeight.hasDefaultValue() || showDefaultValues) {
                props.push(fontWeight);
            }
        }

        if (font.fontStyle) {
            const fontStyle = new FontStyle(font.fontStyle);

            if (!fontStyle.hasDefaultValue() || showDefaultValues) {
                props.push(fontStyle);
            }
        }

        if (font.fontStretch) {
            const fontStretch = new FontStretch(font.fontStretch);

            if (!fontStretch.hasDefaultValue() || showDefaultValues) {
                props.push(fontStretch);
            }
        }

        if (font.lineHeight) {
            const lineHeight = new LineHeight(font.lineHeight, font.fontSize);

            if (!lineHeight.hasDefaultValue() || showDefaultValues) {
                props.push(lineHeight);
            }
        }

        if (font.letterSpacing) {
            const letterSpacing = new LetterSpacing(new Length(font.letterSpacing));

            if (!letterSpacing.hasDefaultValue() || showDefaultValues) {
                props.push(letterSpacing);
            }
        }

        if (font.textAlign) {
            props.push(new TextAlign(font.textAlign));
        }

        if (font.color) {
            props.push(new FontColor(new Color(font.color)));
        }

        return props;
    }

    get style() {
        return new RuleSet(selectorize(this.font.name), this.props);
    }
}

export default TextStyle;
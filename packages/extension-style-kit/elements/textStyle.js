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
    constructor(textStyleObject, containerLayer) {
        this.font = textStyleObject;

        this.props = this.collectProps(containerLayer);
    }

    collectProps(containerLayer) {
        const { font } = this;
        let props = [
            new FontFamily(font.fontFamily),
            new FontSize(new Length(font.fontSize))
        ];

        if (font.fontWeight) {
            props.push(new FontWeight(font.fontWeight));
        }

        if (font.fontStyle) {
            props.push(new FontStyle(font.fontStyle));
        }

        if (font.fontStretch) {
            props.push(new FontStretch(font.fontStretch));
        }

        if (font.lineHeight) {
            props.push(new LineHeight(font.lineHeight, font.fontSize));
        }

        if (font.letterSpacing) {
            props.push(new LetterSpacing(new Length(font.letterSpacing)));
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
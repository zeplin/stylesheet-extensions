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
    constructor(textStyleObject) {
        this.font = textStyleObject;

        this.props = this.collectProps();
    }

    collectProps() {
        const { font } = this;
        let props = [
            new FontFamily(font.fontFamily),
            new FontSize(new Length(font.fontSize))
        ];

        props.push(new FontWeight(font.fontWeight || FontWeight.DEFAULT_VALUE));
        props.push(new FontStyle(font.fontStyle || FontStyle.DEFAULT_VALUE));
        props.push(new FontStretch(font.fontStretch || FontStretch.DEFAULT_VALUE));
        props.push(new LineHeight(font.lineHeight || LineHeight.DEFAULT_VALUE, font.fontSize));
        props.push(new LetterSpacing(
            font.letterSpacing ? new Length(font.letterSpacing) : LetterSpacing.DEFAULT_VALUE
        ));

        if ("textAlign" in font) {
            props.push(new TextAlign(font.textAlign));
        }

        if ("color" in font) {
            props.push(new FontColor(new Color(font.color)));
        }

        return props;
    }

    get style() {
        return new RuleSet(selectorize(this.font.name), this.props);
    }
}

export default TextStyle;
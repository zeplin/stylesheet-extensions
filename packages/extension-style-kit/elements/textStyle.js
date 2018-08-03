import Length from "../values/length";
import Color from "../values/color";
import FontFamily from "../declarations/fontFamily";
import FontSize from "../declarations/fontSize";
import FontStyle from "../declarations/fontStyle";
import FontStretch from "../declarations/fontStretch";
import FontWeight from "../declarations/fontWeight";
import FontColor from "../declarations/fontColor";
import TextAlign from "../declarations/textAlign";
import LineHeight from "../declarations/lineHeight";
import LetterSpacing from "../declarations/letterSpacing";
import RuleSet from "../ruleSet";
import { selectorize } from "../utils";

class TextStyle {
    constructor(textStyleObject) {
        this.font = textStyleObject;

        this.declarations = this.collectDeclarations();
    }

    collectDeclarations() {
        const { font } = this;
        let declarations = [
            new FontFamily(font.fontFamily),
            new FontSize(new Length(font.fontSize))
        ];

        declarations.push(new FontWeight(font.fontWeight || FontWeight.DEFAULT_VALUE));
        declarations.push(new FontStyle(font.fontStyle || FontStyle.DEFAULT_VALUE));
        declarations.push(new FontStretch(font.fontStretch || FontStretch.DEFAULT_VALUE));
        declarations.push(new LineHeight(font.lineHeight || LineHeight.DEFAULT_VALUE, font.fontSize));
        declarations.push(new LetterSpacing(
            font.letterSpacing ? new Length(font.letterSpacing) : LetterSpacing.DEFAULT_VALUE
        ));

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
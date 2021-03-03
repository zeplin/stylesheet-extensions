import { STYLE_PROPS } from "../constants";
import Scalar from "../values/scalar";
import Length from "../values/length";

const useRemUnitForFont = ({ useForFontSizes }) => useForFontSizes;

class LineHeight {
    constructor(lineHeight, fontSize) {
        this.lineHeight = lineHeight;
        this.fontSize = fontSize;
    }

    static get DEFAULT_VALUE() {
        return "normal";
    }

    get name() {
        return STYLE_PROPS.LINE_HEIGHT;
    }

    equals(other) {
        return (this.hasDefaultValue() && other.hasDefaultValue()) ||
            this.lineHeight === other.lineHeight;
    }

    hasDefaultValue() {
        return this.lineHeight === LineHeight.DEFAULT_VALUE;
    }

    getValue(params) {
        if (this.hasDefaultValue()) {
            return this.lineHeight;
        }

        const { unitlessLineHeight } = params;
        const value = unitlessLineHeight
            ? new Scalar(this.lineHeight / this.fontSize)
            : new Length(this.lineHeight, { useRemUnit: useRemUnitForFont });

        return value.toStyleValue(params);
    }
}

export default LineHeight;

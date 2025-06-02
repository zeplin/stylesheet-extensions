import { STYLE_PROPS } from "../constants.js";
import { Length, Scalar } from "../values/index.js";
import { AllParams, LengthParams, RemPreferences, StyleDeclaration } from "../common.js";

const useRemUnitForFont = ({ useForFontSizes }: RemPreferences): boolean => useForFontSizes;

export class LineHeight implements StyleDeclaration {
    private lineHeight: number | "normal";
    private fontSize: number;

    constructor(lineHeight: number | "normal", fontSize: number) {
        this.lineHeight = lineHeight;
        this.fontSize = fontSize;
    }

    static get DEFAULT_VALUE(): "normal" {
        return "normal";
    }

    get name(): string {
        return STYLE_PROPS.LINE_HEIGHT;
    }

    equals(other: LineHeight): boolean {
        return (this.hasDefaultValue() && other.hasDefaultValue()) ||
            this.lineHeight === other.lineHeight;
    }

    hasDefaultValue(): boolean {
        return this.lineHeight === LineHeight.DEFAULT_VALUE;
    }

    getValue(params: AllParams & LengthParams): string {
        if (this.hasDefaultValue()) {
            return LineHeight.DEFAULT_VALUE;
        }

        const lineHeight = this.lineHeight as number;
        const { unitlessLineHeight } = params;
        const value = unitlessLineHeight
            ? new Scalar(lineHeight / this.fontSize)
            : new Length(lineHeight, { useRemUnit: useRemUnitForFont });

        return value.toStyleValue(params);
    }
}

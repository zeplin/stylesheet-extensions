import { LengthParams, RemPreferences, StyleDeclaration } from "../common.js";
import { STYLE_PROPS } from "../constants.js";
import { Length } from "../values/length.js";
import { FourDirectionalValue } from "../values/utility/fourDirectionalValue.js";

const useRemUnit = ({ useForMeasurements }: RemPreferences): boolean => useForMeasurements;

interface PaddingConstructorParams {
    top: Length;
    right: Length;
    bottom: Length;
    left: Length;
}

export class Padding implements StyleDeclaration {
    top: Length;
    right: Length;
    bottom: Length;
    left: Length;
    private fourDirectionalValue: FourDirectionalValue<Length>;

    static get Zero(): Padding {
        return new Padding({
            top: new Length(0, { useRemUnit }),
            right: new Length(0, { useRemUnit }),
            bottom: new Length(0, { useRemUnit }),
            left: new Length(0, { useRemUnit })
        });
    }

    constructor({ top, right, bottom, left }: PaddingConstructorParams) {
        this.top = top;
        this.right = right;
        this.bottom = bottom;
        this.left = left;
        this.fourDirectionalValue = new FourDirectionalValue({ top, right, bottom, left });
    }

    get name(): string {
        return STYLE_PROPS.PADDING;
    }

    equals(other: Padding): boolean {
        return this.fourDirectionalValue.equals(other.fourDirectionalValue);
    }

    getValue(params: LengthParams): string {
        return this.fourDirectionalValue.toStyleValue(params);
    }
}


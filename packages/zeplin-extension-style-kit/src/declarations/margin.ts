import { LengthParams, RemPreferences, StyleDeclaration } from "../common";
import { STYLE_PROPS } from "../constants";
import { Length } from "../values/length";
import { FourDirectionalValue } from "../values/utility/fourDirectionalValue";

const useRemUnit = ({ useForMeasurements }: RemPreferences): boolean => useForMeasurements;

interface MarginConstructorParams {
    top: Length;
    right: Length;
    bottom: Length;
    left: Length;
}

export class Margin implements StyleDeclaration {
    top: Length;
    right: Length;
    bottom: Length;
    left: Length;
    private fourDirectionalValue: FourDirectionalValue<Length>;

    static get Zero(): Margin {
        return new Margin({
            top: new Length(0, { useRemUnit }),
            right: new Length(0, { useRemUnit }),
            bottom: new Length(0, { useRemUnit }),
            left: new Length(0, { useRemUnit })
        });
    }

    constructor({ top, right, bottom, left }: MarginConstructorParams) {
        this.top = top;
        this.right = right;
        this.bottom = bottom;
        this.left = left;
        this.fourDirectionalValue = new FourDirectionalValue({ top, right, bottom, left });
    }

    get name(): string {
        return STYLE_PROPS.MARGIN;
    }

    equals(other: Margin): boolean {
        return this.fourDirectionalValue.equals(other.fourDirectionalValue);
    }

    getValue(params: LengthParams): string {
        return this.fourDirectionalValue.toStyleValue(params);
    }
}


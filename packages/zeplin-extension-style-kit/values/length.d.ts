import { LengthParams, LengthOptions } from "../common";

declare interface FourDirectionLengths {
    top: Length;
    right: Length;
    bottom: Length;
    left: Length;
}

declare class Length {
    static toFourDirectionLengths({ top, right, bottom, left }: FourDirectionLengths, options: LengthOptions);
    static toStyleFourDirectionLengths({ top, right, bottom, left }: FourDirectionLengths, params: LengthParams);
    static doFourDirectionLengthsEqual(one: FourDirectionLengths , other: FourDirectionLengths);

    constructor(value: number, options?: LengthOptions);

    equals(other: Length): boolean;

    toStyleValue(params: LengthParams): string;
}

export = Length;

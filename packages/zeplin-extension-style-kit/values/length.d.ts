import { LengthParams, LengthOptions } from "../common";

declare class Length {
    constructor(value: number, options?: LengthOptions);

    equals(other: Length): boolean;

    toStyleValue(params: LengthParams): string;
}

export = Length;

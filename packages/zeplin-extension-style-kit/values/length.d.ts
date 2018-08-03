import { LengthParams } from "../common";

declare class Length {
    constructor(value: number, unit = "px");

    equals(other: Length): boolean;

    toStyleValue(params: LengthParams): string;
}

export = Length;
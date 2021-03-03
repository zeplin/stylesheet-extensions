import { LengthParams } from "../common";

declare class LineHeight {
    constructor(lineHeight: number, fontSize: number);

    name: string;

    hasDefaultValue(): boolean;

    equals(other: LineHeight): boolean;

    getValue(params: LengthParams): string;
}

export = LineHeight;

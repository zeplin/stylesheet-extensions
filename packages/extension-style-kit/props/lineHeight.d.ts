import { VariableMap, LengthParams } from "../common";

declare class LineHeight {
    constructor(lineHeight: number, fontSize: number);

    name: string;

    hasDefaultValue(): boolean;

    equals(other: LineHeight): boolean;

    getValue(params: LengthParams, variables: VariableMap): string;
}

export = LineHeight;
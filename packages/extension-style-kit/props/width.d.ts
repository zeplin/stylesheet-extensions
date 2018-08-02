import { VariableMap, LengthParams } from "../common";
import Length from "../values/length";

declare class Width {
    constructor(length: Length);

    name: string;

    equals(other: Width): boolean;

    getValue(params: LengthParams, variables: VariableMap): string;
}

export = Width;
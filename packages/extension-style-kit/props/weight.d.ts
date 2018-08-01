import { VariableMap, LengthParams } from "../common";
import Length from "../values/length";

declare class Weight {
    constructor(length: Length);

    name: string;

    equals(other: Weight): boolean;

    getValue(params: LengthParams, variables: VariableMap): string;
}

export = Weight;
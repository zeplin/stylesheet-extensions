import { VariableMap, LengthParams } from "../common";
import Length from "../values/length";

declare class Gap {
    constructor(length: Length);

    name: string;

    equals(other: Gap): boolean;

    getValue(params: LengthParams, variables: VariableMap): string;
}

export = Gap;

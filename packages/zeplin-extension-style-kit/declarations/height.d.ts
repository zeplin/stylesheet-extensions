import { VariableMap, LengthParams } from "../common";
import Length from "../values/length";

declare class Height {
    constructor(length: Length);

    name: string;

    equals(other: Height): boolean;

    getValue(params: LengthParams, variables: VariableMap): string;
}

export = Height;
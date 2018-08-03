import { VariableMap, LengthParams } from "../common";
import Length from "../values/length";

declare class FontSize {
    constructor(length: Length);

    name: string;

    hasDefaultValue(): boolean;

    equals(other: FontSize): boolean;

    getValue(params: LengthParams, variables: VariableMap): string;
}

export = FontSize;
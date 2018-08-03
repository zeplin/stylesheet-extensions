import { VariableMap, LengthParams } from "../common";
import Length from "../values/length";

declare class LetterSpacing {
    constructor(value: Length);

    name: string;

    hasDefaultValue(): boolean;

    equals(other: LetterSpacing): boolean;

    getValue(params: LengthParams, variables: VariableMap): string;
}

export = LetterSpacing;
import { ColorParams, VariableMap } from "../common";

declare class FontColor {
    constructor(values: string[]);

    name: string;

    hasDefaultValue(): boolean;

    equals(other: FontColor): boolean;

    getValue(params: ColorParams, variables: VariableMap): string;
}

export = FontColor;
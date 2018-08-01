import { ColorParams, VariableMap, LengthParams } from "../common";
import Color from "../values/color";
import Length from "../values/length";

declare class TextStroke {
    constructor(length: Length, color: Color);

    name: string;

    equals(other: TextStroke): boolean;

    getValue(params: ColorParams & LengthParams, variables: VariableMap): string;
}

export = TextStroke;
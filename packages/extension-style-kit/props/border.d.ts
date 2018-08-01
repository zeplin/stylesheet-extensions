import { ColorParams, VariableMap, LengthParams } from "../common";
import Color from "../values/color";
import Gradient from "../values/gradient";
import Length from "../values/length";

declare class Border {
    constructor({ style: string, width: Length, color: Color });

    name: string;

    equals(other: Border): boolean;

    getValue(params: ColorParams & LengthParams, variables: VariableMap): string;
}

export = Border;
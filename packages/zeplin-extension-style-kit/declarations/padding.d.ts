import { VariableMap, LengthParams } from "../common";
import Length from "../values/length";

declare class Padding {
    static get Zero(): Padding;

    constructor(lengths: { top: Length, right: Length, bottom: Length, left: Length });

    name: string;

    equals(other: Padding): boolean;

    getValue(params: LengthParams, variables: VariableMap): string;
}

export = Padding;

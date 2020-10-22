import { VariableMap, LengthParams } from "../common";
import Area from "../values/Area";

declare class Padding {
    static get Zero(): Padding;

    constructor(area: Area);

    name: string;

    equals(other: Padding): boolean;

    getValue(params: LengthParams, variables: VariableMap): string;
}

export = Padding;

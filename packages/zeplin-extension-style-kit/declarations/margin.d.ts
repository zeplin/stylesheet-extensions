import { VariableMap, LengthParams } from "../common";
import Area from "../values/Area";

declare class Margin {
    static get Zero(): Margin;

    constructor(area: Area);

    name: string;

    equals(other: Margin): boolean;

    getValue(params: LengthParams, variables: VariableMap): string;
}

export = Margin;

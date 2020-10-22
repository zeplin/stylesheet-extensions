import { VariableMap, LengthParams } from "../common";
import Length from "../values/length";

declare class Margin {
    static get Zero(): Margin;

    constructor(area: { top: Length, right: Length, bottom: Length, left: Length });

    name: string;

    equals(other: Margin): boolean;

    getValue(params: LengthParams, variables: VariableMap): string;
}

export = Margin;

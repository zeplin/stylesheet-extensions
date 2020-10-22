import { VariableMap, LengthParams } from "../common";
import Area from "../values/utility/area";
import Length from "../values/length";

declare class Padding {
    static get Zero(): Padding;

    constructor(area: { top: Length, right: Length, bottom: Length, left: Length });

    name: string;

    equals(other: Padding): boolean;

    getValue(params: LengthParams, variables: VariableMap): string;
}

export = Padding;

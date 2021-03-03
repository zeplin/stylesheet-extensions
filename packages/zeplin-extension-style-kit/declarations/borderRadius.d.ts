import { LengthParams } from "../common";
import Length from "../values/length";

declare class BorderRadius {
    constructor(length: Length);

    name: string;

    equals(other: BorderRadius): boolean;

    getValue(params: LengthParams): string;
}

export = BorderRadius;

import { LengthParams } from "../common";
import Length from "../values/length";

declare class BorderWidth {
    constructor(length: Length);

    name: string;

    equals(other: BorderWidth): boolean;

    getValue(params: LengthParams): string;
}

export = BorderWidth;

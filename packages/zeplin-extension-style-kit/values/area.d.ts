import { LengthParams, LengthOptions } from "../common";

interface AreaParams {
    top: number;
    right: number;
    bottom: number;
    left: number;
}
declare class Area {
    constructor(value: AreaParams, options?: LengthOptions);

    equals(other: Area): boolean;

    toStyleValue(params: LengthParams): string;
}

export = Area;

import { ColorParams, VariableMap } from "../common";

declare class LinearColorStop {
    constructor(colorStopObject: object, pFirst: number, pLast: number, pStart: number, pEnd: number);

    equals(other: LinearColorStop): boolean;

    toStyleValue(params: ColorParams, variables: VariableMap): string;
}

export = LinearColorStop;

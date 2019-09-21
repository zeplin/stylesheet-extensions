import { ColorParams, VariableMap } from "../common";

declare class LinearColorStop {
    constructor(colorStopObject: object);

    equals(other: LinearColorStop): boolean;

    toStyleValue(params: ColorParams, variables: VariableMap): string;
}

export = LinearColorStop;

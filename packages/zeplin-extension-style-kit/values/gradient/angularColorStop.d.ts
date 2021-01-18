import { ColorParams, VariableMap } from "../../common";

declare class AngularColorStop {
    constructor(colorStopObject: object);

    equals(other: AngularColorStop): boolean;

    toStyleValue(params: ColorParams, variables: VariableMap): string;
}

export = AngularColorStop;

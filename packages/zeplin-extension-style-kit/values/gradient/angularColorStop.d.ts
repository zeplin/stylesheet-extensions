import { ColorParams } from "../../common";

declare class AngularColorStop {
    constructor(colorStopObject: object);

    equals(other: AngularColorStop): boolean;

    // TODO: add @zeplin/extension-model types
    toStyleValue(params: ColorParams, getColorName: (colorObject: object) => string): string;
}

export = AngularColorStop;

import { ColorParams } from "../../common";

declare class LinearColorStop {
    constructor(colorStopObject: object);

    equals(other: LinearColorStop): boolean;

    // TODO: add @zeplin/extension-model types
    toStyleValue(params: ColorParams, colorNameResolver: (colorObject: object) => string): string;
}

export = LinearColorStop;

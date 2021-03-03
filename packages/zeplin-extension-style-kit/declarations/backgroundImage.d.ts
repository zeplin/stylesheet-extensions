import { ColorParams } from "../common";
import Gradient from "../values/gradient";

declare class BackgroundImage {
    constructor(images: Gradient[]);

    name: string;

    equals(other: BackgroundImage): boolean;

    getValue(params: ColorParams, container: object, formatVariable: (colorObject: object) => string): string;
}

export = BackgroundImage;

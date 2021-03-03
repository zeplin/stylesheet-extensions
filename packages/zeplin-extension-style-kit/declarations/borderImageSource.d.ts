import { ColorParams} from "../common";
import Gradient from "../values/gradient";

declare class BorderImageSource {
    constructor(images: Gradient[]);

    name: string;

    equals(other: BorderImageSource): boolean;

    getValue(params: ColorParams, container: object, formatColorVariable: (colorObject: object) => string): string;
}

export = BorderImageSource;

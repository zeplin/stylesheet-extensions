import { STYLE_PROPS } from "../constants.js";
import { StyleDeclaration } from "../common.js";

type BackgroundOriginValue = "border-box" | "padding-box" | "content-box";

export class BackgroundOrigin implements StyleDeclaration {
    private values: BackgroundOriginValue[];

    constructor(values: BackgroundOriginValue[]) {
        this.values = values;
    }

    get name(): string {
        return STYLE_PROPS.BACKGROUND_ORIGIN;
    }

    equals(other: BackgroundOrigin): boolean {
        return this.values.join(", ") === other.values.join(", ");
    }

    getValue(): string {
        return this.values.join(", ");
    }
}

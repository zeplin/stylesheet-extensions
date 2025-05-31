import { STYLE_PROPS } from "../constants.js";
import { StyleDeclaration } from "../common.js";

type BackgroundClipValue = "border-box" | "padding-box" | "content-box" | "text";

export class BackgroundClip implements StyleDeclaration {
    private values: BackgroundClipValue[];

    constructor(values: BackgroundClipValue[]) {
        this.values = values;
    }

    get name(): string {
        return STYLE_PROPS.BACKGROUND_CLIP;
    }

    equals(other: BackgroundClip): boolean {
        return this.values.join(", ") === other.values.join(", ");
    }

    getValue(): string {
        return this.values.join(", ");
    }
}

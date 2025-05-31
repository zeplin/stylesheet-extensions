import { webkit } from "../utils.js";
import { STYLE_PROPS } from "../constants.js";
import { StyleDeclaration } from "../common.js";

class TextFillColor implements StyleDeclaration {
    private value: string;

    constructor(value: string) {
        this.value = value;
    }

    get name(): string {
        return STYLE_PROPS.TEXT_FILL_COLOR;
    }

    equals(other: TextFillColor): boolean {
        return this.value === other.value;
    }

    getValue(): string {
        return this.value;
    }
}

const webKitTextFillColor = webkit(TextFillColor);

export {
    webKitTextFillColor as TextFillColor
};

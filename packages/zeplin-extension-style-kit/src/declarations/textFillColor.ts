import { webkit } from "../utils";
import { STYLE_PROPS } from "../constants";
import { StyleDeclaration } from "../common";

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

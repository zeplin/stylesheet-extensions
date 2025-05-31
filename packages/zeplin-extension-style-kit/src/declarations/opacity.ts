import { STYLE_PROPS } from "../constants.js";
import { Percent } from "../values/index.js";

export class Opacity {
    private value: Percent;

    constructor(value: Percent) {
        this.value = value;
    }

    get name(): string {
        return STYLE_PROPS.OPACITY;
    }

    equals(other: Opacity): boolean {
        return this.value.equals(other.value);
    }

    getValue(): string {
        return this.value.toStyleValue();
    }
}

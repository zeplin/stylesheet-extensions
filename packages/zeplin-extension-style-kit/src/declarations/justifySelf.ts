import { StyleDeclaration } from "../common.js";
import { STYLE_PROPS } from "../constants.js";

export type JustifySelfValue = "center" | "max" | "min" | "stretch" | "inherit" | "auto";

const valueMapper: Record<JustifySelfValue, string> = {
    center: "center",
    max: "flex-end",
    min: "flex-start",
    stretch: "stretch",
    inherit: "inherit",
    auto: "auto"
} as const;

export class JustifySelf implements StyleDeclaration {
    private value: JustifySelfValue;

    constructor(value: JustifySelfValue) {
        this.value = value;
    }

    get name(): string {
        return STYLE_PROPS.JUSTIFY_SELF;
    }

    equals(other: JustifySelf): boolean {
        return this.value === other.value;
    }

    getValue(): string {
        return valueMapper[this.value];
    }
}

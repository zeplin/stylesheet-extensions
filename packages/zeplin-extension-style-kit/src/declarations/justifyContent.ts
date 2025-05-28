import { STYLE_PROPS } from "../constants";
import { StyleDeclaration } from "../common";

type JustifyContentValue = "center" | "max" | "min" | "space-between";
type MappedJustifyContentValue = "center" | "flex-end" | "flex-start" | "space-between";

const valueMapper: Record<JustifyContentValue, MappedJustifyContentValue> = {
    "center": "center",
    "max": "flex-end",
    "min": "flex-start",
    "space-between": "space-between"
} as const;

export class JustifyContent implements StyleDeclaration {
    private value: JustifyContentValue;

    constructor(value: JustifyContentValue) {
        this.value = value;
    }

    get name(): string {
        return STYLE_PROPS.JUSTIFY_CONTENT;
    }

    equals(other: JustifyContent): boolean {
        return this.value === other.value;
    }

    getValue(): MappedJustifyContentValue {
        return valueMapper[this.value];
    }
}

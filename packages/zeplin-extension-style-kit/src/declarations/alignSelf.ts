import { StyleDeclaration } from "../common";
import { STYLE_PROPS } from "../constants";

export type AlignSelfValue = "center" | "max" | "min" | "stretch" | "inherit";

const valueMapper: Record<AlignSelfValue, string> = {
    center: "center",
    max: "flex-end",
    min: "flex-start",
    stretch: "stretch",
    inherit: "inherit"
} as const;

export class AlignSelf implements StyleDeclaration {
    private value: AlignSelfValue;

    constructor(value: AlignSelfValue) {
        this.value = value;
    }

    get name(): string {
        return STYLE_PROPS.ALIGN_SELF;
    }

    equals(other: AlignSelf): boolean {
        return this.value === other.value;
    }

    getValue(): string {
        return valueMapper[this.value];
    }
}

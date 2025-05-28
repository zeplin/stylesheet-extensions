import { STYLE_PROPS } from "../constants";
import { StyleDeclaration } from "../common";

export type AlignItemsValue = "center" | "max" | "min" | "stretch" | "inherit";

const valueMapper: Record<AlignItemsValue, string> = {
    center: "center",
    max: "flex-end",
    min: "flex-start",
    stretch: "stretch",
    inherit: "inherit"
} as const;

export class AlignItems implements StyleDeclaration {
    private value: AlignItemsValue;

    constructor(value: AlignItemsValue) {
        this.value = value;
    }

    get name(): string {
        return STYLE_PROPS.ALIGN_ITEMS;
    }

    equals(other: AlignItems): boolean {
        return this.value === other.value;
    }

    getValue(): string {
        return valueMapper[this.value];
    }
}

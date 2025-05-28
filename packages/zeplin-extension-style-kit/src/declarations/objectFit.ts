import { StyleDeclaration } from "../common";
import { STYLE_PROPS } from "../constants";

type ObjectFitValue = "fill" | "contain" | "cover" | "none" | "scale-down";

export class ObjectFit implements StyleDeclaration {
    private value: ObjectFitValue;

    constructor(value: ObjectFitValue) {
        this.value = value;
    }

    get name(): string {
        return STYLE_PROPS.OBJECT_FIT;
    }

    equals(other: ObjectFit): boolean {
        return this.value === other.value;
    }

    getValue(): ObjectFitValue {
        return this.value;
    }
}

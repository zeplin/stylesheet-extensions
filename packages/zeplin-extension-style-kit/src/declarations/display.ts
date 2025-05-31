import { STYLE_PROPS } from "../constants.js";
import { StyleDeclaration } from "../common.js";

type DisplayValue =
    | "inline"
    | "block"
    | "contents"
    | "flex"
    | "grid"
    | "inline-block"
    | "inline-flex"
    | "inline-grid"
    | "inline-table"
    | "list-item"
    | "run-in"
    | "table"
    | "table-caption"
    | "table-column-group"
    | "table-header-group"
    | "table-footer-group"
    | "table-row-group"
    | "table-cell"
    | "table-column"
    | "table-row"
    | "none";

export class Display implements StyleDeclaration {
    private value: DisplayValue;

    constructor(value: DisplayValue) {
        this.value = value;
    }

    get name(): string {
        return STYLE_PROPS.DISPLAY;
    }

    equals(other: Display): boolean {
        return this.value === other.value;
    }

    getValue(): string {
        return this.value;
    }

    static flex(): Display {
        return new Display("flex");
    }
}

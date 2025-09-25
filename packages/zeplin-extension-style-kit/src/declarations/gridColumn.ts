import { StyleDeclaration } from "../common.js";
import { STYLE_PROPS } from "../constants.js";

export class GridColumn implements StyleDeclaration {
    private index?: number;
    private span?: number;

    constructor(index?: number, span?: number) {
        this.index = index;
        this.span = span;
    }

    get name(): string {
        return STYLE_PROPS.GRID_COLUMN;
    }

    equals(other: GridColumn): boolean {
        return this.index === other.index && this.span === other.span;
    }

    getValue(): string {
        return `${this.index ?? "auto"} / ${this.span ? `span ${this.span}` : "auto"}`;
    }
}

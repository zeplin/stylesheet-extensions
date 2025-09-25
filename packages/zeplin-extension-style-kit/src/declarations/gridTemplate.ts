import { GridSize } from "@zeplin/extension-model";
import { LengthParams, StyleDeclaration } from "../common.js";
import { STYLE_PROPS } from "../constants.js";
import { Length } from "../values/length.js";

type GridTemplateType = "rows" | "columns";

function gridSizeEquals(one: GridSize, two: GridSize) {
    return one.type === two.type && one.value === two.value;
}

export class GridTemplate implements StyleDeclaration {
    type: GridTemplateType;
    private count: number;
    private gridSizes: GridSize[];

    constructor(type: GridTemplateType, count: number, sizes: GridSize[]) {
        this.type = type;
        this.count = count;
        this.gridSizes = sizes;
    }

    get name(): string {
        return this.type === "columns" ? STYLE_PROPS.GRID_TEMPLATE_COLUMNS : STYLE_PROPS.GRID_TEMPLATE_ROWS;
    }

    equals(other: GridTemplate): boolean {
        if (this.count !== other.count) {
            return false;
        }
        const gridSizesAreEqual = this.gridSizes.every((size, index) => gridSizeEquals(size, other.gridSizes[index]));
        return gridSizesAreEqual;
    }

    getValue(params: LengthParams): string {
        return this.gridSizes.map((gridSize) => {
            if (gridSize.type === "fixed") {
                return new Length(gridSize.value ?? 0).toStyleValue(params)
            }
            return `${gridSize.value ?? 0}fr`
        }).join(" ");
    }
}

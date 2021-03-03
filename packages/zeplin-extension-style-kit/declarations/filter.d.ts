import { StyleFunction, StyleParams } from "../common";

declare class Filter {
    constructor(filters: Array<StyleFunction>);

    name: string;

    equals(other: Filter): boolean;

    getValue(params: StyleParams, container: object, formatColorVariable: (colorObject: object) => string): string;
}

export = Filter;

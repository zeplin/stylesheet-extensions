import { StyleFunction, StyleParams, VariableMap } from "../common";

declare class Filter {
    constructor(filters: Array<StyleFunction>);

    name: string;

    equals(other: Filter): boolean;

    getValue(params: StyleParams, variables: VariableMap): string;
}

export = Filter;
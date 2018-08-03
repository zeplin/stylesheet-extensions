import { StyleFunction, StyleParams } from "../common";

declare class BackdropFilter {
    constructor(filters: Array<StyleFunction>);

    name: string;

    equals(other: BackdropFilter): boolean;

    getValue(params: StyleParams): string;
}

export = BackdropFilter;
import { StyleFunction, StyleParams, VariableMap } from "../common";

declare class Transform {
    constructor(fns: Array<StyleFunction>);

    name: string;

    equals(other: Transform): boolean;

    getValue(params: StyleParams, colorNameResolver: (colorObject: object) => string): string;
}

export = Transform;

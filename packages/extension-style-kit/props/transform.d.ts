import { StyleFunction } from "../common";

declare class Transform {
    constructor(filters: Array<StyleFunction>);

    name: string;

    equals(other: Transform): boolean;

    getValue(): string;
}

export = Transform;
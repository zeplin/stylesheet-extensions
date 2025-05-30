import { StyleDeclaration } from "../common";

export class Mixin implements StyleDeclaration {
    id: string;

    constructor(identifier: string) {
        this.id = identifier;
    }

    get name(): string {
        return this.id;
    }

    get identifier(): string {
        return this.id;
    }

    equals(other: Mixin): boolean {
        return this.id === other.id;
    }

    getValue(): string | number {
        return "";
    }
}

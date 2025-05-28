export class Mixin {
    private id: string;

    constructor(identifier: string) {
        this.id = identifier;
    }

    get identifier(): string {
        return this.id;
    }

    equals(other: Mixin): boolean {
        return this.id === other.id;
    }
}

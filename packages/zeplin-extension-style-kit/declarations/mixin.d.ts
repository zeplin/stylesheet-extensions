declare class Mixin {
    constructor(id: string);

    identifier: string;

    equals(other: Mixin): boolean;
}

export = Mixin;

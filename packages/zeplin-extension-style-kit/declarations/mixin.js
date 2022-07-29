class Mixin {
    constructor(identifier) {
        this.id = identifier;
    }

    get identifier() {
        return this.id;
    }

    equals(other) {
        return this.id === other.id;
    }
}

export default Mixin;

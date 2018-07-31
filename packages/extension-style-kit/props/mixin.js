class Mixin {
    constructor(identifier) {
        this.id = identifier;
    }

    get identifier() {
        return this.id;
    }
}

export default Mixin;
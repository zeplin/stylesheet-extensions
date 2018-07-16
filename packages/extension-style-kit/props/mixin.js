class Mixin {
    constructor(selector) {
        this.selector = selector;
    }

    getValue() {
        return `${this.selector}()`;
    }
}

export default Mixin;
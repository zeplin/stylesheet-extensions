class FourDirectionalValue {
    constructor({ top, right, bottom, left }) {
        this.top = top;
        this.right = right;
        this.bottom = bottom;
        this.left = left;
    }

    valueOf() {
        return `fourDirectionalValue::t:(${this.top.valueOf()}):r:(${this.right.valueOf()}):b:(${this.bottom.valueOf()}):l:(${this.left.valueOf()})`;
    }

    equals(other) {
        return this.top.equals(other.top) &&
            this.right.equals(other.right) &&
            this.bottom.equals(other.bottom) &&
            this.left.equals(other.left);
    }

    toStyleValue(params) {
        if (this.top.equals(this.bottom) && this.right.equals(this.left) && this.top.equals(this.right)) {
            return this.top.toStyleValue(params);
        }

        if (this.top.equals(this.bottom) && this.right.equals(this.left)) {
            return `${this.top.toStyleValue(params)} ${this.right.toStyleValue(params)}`;
        }

        if (this.right.equals(this.left)) {
            return `${this.top.toStyleValue(params)} ${this.right.toStyleValue(params)} ${this.bottom.toStyleValue(params)}`;
        }

        return `${this.top.toStyleValue(params)} ${this.right.toStyleValue(params)} ${this.bottom.toStyleValue(params)} ${this.left.toStyleValue(params)}`;
    }
}

export default FourDirectionalValue;

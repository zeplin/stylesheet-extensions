import Scalar from "./scalar";

class Length {
    constructor(value, unit = "px") {
        this.value = value;
        this.unit = unit;
    }

    equals(other) {
        return this.value === other.value && this.unit === other.unit;
    }

    toStyleValue({ densityDivisor }) {
        return this.value === 0 ? "0" : `${new Scalar(this.value / densityDivisor, 1).toStyleValue()}${this.unit}`;
    }
}

export default Length;
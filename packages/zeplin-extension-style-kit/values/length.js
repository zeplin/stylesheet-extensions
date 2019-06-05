import Scalar from "./scalar";

class Length {
    constructor(value, { unit = "px", precision = 1 } = {}) {
        this.value = value;
        this.unit = unit;
        this.precision = precision;
    }

    valueOf() {
        const { value, unit } = this;

        return `length::v:${value}:u:${unit}`;
    }

    equals(other) {
        return this.value === other.value && this.unit === other.unit;
    }

    toStyleValue({ densityDivisor }) {
        return this.value === 0 ? "0" : `${new Scalar(this.value / densityDivisor, this.precision).toStyleValue()}${this.unit}`;
    }
}

export default Length;

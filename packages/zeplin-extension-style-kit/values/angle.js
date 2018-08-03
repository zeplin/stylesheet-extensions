import Scalar from "./scalar";

class Angle {
    constructor(value, unit = "deg") {
        this.value = value;
        this.unit = unit;
    }

    valueOf() {
        const { value, unit } = this;

        return `angle::v:${value}:u:${unit}`;
    }

    equals(other) {
        return this.value === other.value && this.unit === other.unit;
    }

    toStyleValue() {
        return this.value === 0 ? "0" : `${new Scalar(this.value).toStyleValue()}${this.unit}`;
    }
}

export default Angle;
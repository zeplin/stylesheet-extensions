function round(number, precision) {
    const formattedNumber = Number(number).toLocaleString("en-US", {
        useGrouping: false,
        maximumFractionDigits: precision
    });

    return Number(formattedNumber);
}

const DEFAULT_PRECISION = 2;

class Scalar {
    constructor(value, precision = DEFAULT_PRECISION) {
        this.value = value;
        this.precision = precision;
    }

    valueOf() {
        const { value, precision } = this;

        return `scalar::v:${value}:p:${precision}`;
    }

    equals(other) {
        return this.value === other.value;
    }

    toStyleValue() {
        return `${round(this.value, this.precision)}`;
    }
}

export default Scalar;
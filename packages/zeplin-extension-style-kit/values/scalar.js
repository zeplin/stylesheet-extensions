function round(number, precision) {
    const formattedNumber = Number(number).toLocaleString("en-US", {
        useGrouping: false,
        maximumFractionDigits: precision
    });

    return Number(formattedNumber);
}

class Scalar {
    constructor(value, precision = 2) {
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
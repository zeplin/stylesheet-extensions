function round(number, precision) {
    var formattedNumber = Number(number).toLocaleString("en-US", {
        useGrouping: false,
        maximumFractionDigits: precision
    });

    return Number(formattedNumber);
}

class Scalar {
    constructor(value) {
        this.value = value || 0;
    }

    equals(other) {
        return this.value === other.value;
    }

    toStyleValue() {
        return round(this.value, 2);
    }
}

export default Scalar;
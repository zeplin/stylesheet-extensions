import { STYLE_PROPS } from "../constants";
import Length from "../values/length";

const useRemUnitForMeasurement = ({ useForMeasurements }) => useForMeasurements;

class Padding {
    static get Zero() {
        return new Padding(
            Length.toFourDirectionLengths(
                { top: 0, right: 0, bottom: 0, left: 0 },
                { useRemUnitForMeasurement }
            )
        );
    }

    constructor({ top, right, bottom, left }) {
        this.top = top;
        this.right = right;
        this.bottom = bottom;
        this.left = left;
    }

    get name() {
        return STYLE_PROPS.PADDING;
    }

    equals(other) {
        return Length.doFourDirectionLengthsEqual(this, other);
    }

    getValue(params) {
        return Length.toStyleFourDirectionLengths(this, params);
    }
}

export default Padding;

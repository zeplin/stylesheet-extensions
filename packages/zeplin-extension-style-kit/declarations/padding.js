import { STYLE_PROPS } from "../constants";
import Length from "../values/length";
import FourDirectionalValue from "../values/utility/fourDirectionalValue";

const useRemUnit = ({ useForMeasurements }) => useForMeasurements;

class Padding {
    static get Zero() {
        return new Padding({
            top: new Length(0, { useRemUnit }),
            right: new Length(0, { useRemUnit }),
            bottom: new Length(0, { useRemUnit }),
            left: new Length(0, { useRemUnit })
        });
    }

    constructor({ top, right, bottom, left }) {
        this.top = top;
        this.right = right;
        this.bottom = bottom;
        this.left = left;
        this.fourDirectionalValue = new FourDirectionalValue({ top, right, bottom, left });
    }

    get name() {
        return STYLE_PROPS.PADDING;
    }

    equals(other) {
        return this.fourDirectionalValue.equals(other.fourDirectionalValue);
    }

    getValue(params, variables) {
        return this.fourDirectionalValue.toStyleValue(params, variables);
    }
}

export default Padding;

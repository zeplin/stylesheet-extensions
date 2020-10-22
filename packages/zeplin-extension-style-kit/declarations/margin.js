import { STYLE_PROPS } from "../constants";
import Area from "../values/area";

const useRemUnitForMeasurement = ({ useForMeasurements }) => useForMeasurements;

class Margin {
    static get Zero() {
        return new Margin(new Area({ top: 0, right: 0, bottom: 0, left: 0 }, { useRemUnitForMeasurement }));
    }

    constructor(area) {
        this.value = area;
    }

    get name() {
        return STYLE_PROPS.MARGIN;
    }

    equals(other) {
        return this.value.equals(other.value);
    }

    getValue(params, variables) {
        return this.value.toStyleValue(params, variables);
    }
}

export default Margin;

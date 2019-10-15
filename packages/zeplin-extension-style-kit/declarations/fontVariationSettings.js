import { STYLE_PROPS } from "../constants";
import Scalar from "../values/scalar";

class FontVariationSettings {
    constructor(axes) {
        this.axes = axes;
    }

    static get DEFAULT_VALUE() {
        return {};
    }

    get name() {
        return STYLE_PROPS.FONT_VARIATION_SETTINGS;
    }

    equals(other) {
        const axisNames = Object.keys(this.axes);

        if (axisNames.length !== Object.keys(other.axes).length) {
            return false;
        }

        return axisNames.every(axisName => this.axes[axisName] === other.axes[axisName]);
    }

    hasDefaultValue() {
        return Object.keys(this.axes).length === 0;
    }

    getValue() {
        if (this.hasDefaultValue()) {
            return "normal";
        }

        return Object.entries(this.axes)
            .map(([axisName, value]) => `"${axisName}" ${new Scalar(value).toStyleValue()}`)
            .join(", ");
    }
}

export default FontVariationSettings;

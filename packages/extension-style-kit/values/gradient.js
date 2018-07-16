import Color from "./color";
import Percent from "./percent";

/* eslint-disable no-magic-numbers */
function toCSSAngle(angle) {
    switch (angle) {
        case 0:
            return "to top";

        case 90:
            return "to right";

        case 180:
            return "to bottom";

        case 270:
            return "to left";

        default:
            return `${angle}deg`;
    }
}
/* eslint-enable no-magic-numbers */

class Gradient {
    constructor(gradientObject) {
        this.object = gradientObject;
    }

    static getColorStopStyle(colorStop, colorFormat, variables) {
        let pos = "";

        if (colorStop.position !== 1 && colorStop.position) {
            pos = ` ${new Percent(colorStop.position).toStyleValue()}`;
        }

        return `${new Color(colorStop.color).toStyleValue({ colorFormat }, variables)}${pos}`;
    }

    equals(other) {
        return (
            this.colorStops.length === other.colorStops.length &&
            this.colorStops.every((cs, index) => {
                const otherCs = other.colorStops[index];

                return otherCs.position === cs.position && otherCs.color.equals(cs.color);
            })
        );
    }

    toStyleValue({ colorFormat }, variables) {
        const { object: gradient } = this;
        const colorStopStyle = gradient.colorStops.map(
            cs => Gradient.getColorStopStyle(cs, colorFormat, variables)
        ).join(", ");

        switch (gradient.type) {
            case "linear":
                // TODO: calculate gradient stops with correct gradient axis
                return `linear-gradient(${toCSSAngle(gradient.angle)}, ${colorStopStyle})`;

            case "radial":
                // TODO: calculate gradient end point according to gradient.to and element rect
                // TODO: elliptic gradients are missing
                return `radial-gradient(circle at ${new Percent(gradient.from.x).toStyleValue()} ${new Percent(gradient.from.y).toStyleValue()}, ${colorStopStyle})`;

            case "angular":
                // TODO: far from correct, only available via polyfill: https://github.com/leaverou/conic-gradient
                return `conic-gradient(${colorStopStyle}, ${Gradient.getColorStopStyle(gradient.colorStops[0], colorFormat, variables)})`;
            default:
                return "";
        }
    }
}

export default Gradient;
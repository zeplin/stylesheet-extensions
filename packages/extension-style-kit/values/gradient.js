import { Gradient as ExtensionGradient } from "@zeplin/extension-model";

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

function generateColorGradient({ r, g, b, a }) {
    return {
        type: "linear",
        from: {
            x: 0.5,
            y: 0
        },
        to: {
            x: 0.5,
            y: 1
        },
        colorStops: [{
            color: { r, g, b, a },
            position: 0
        }, {
            color: { r, g, b, a },
            position: 1
        }]
    };
}

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

    static fromRGBA({ r, g, b, a }) {
        return new Gradient(
            new ExtensionGradient(
                generateColorGradient({ r, g, b, a }),
                100, 100
            )
        );
    }

    equals(other) {
        return (
            this.object.type === other.object.type &&
            this.object.angle === other.object.angle &&
            this.object.colorStops.length === other.object.colorStops.length &&
            this.object.colorStops.every((cs, index) => {
                const otherCs = other.object.colorStops[index];

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
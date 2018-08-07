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

class ColorStop {
    constructor(colorStopObject) {
        this.object = colorStopObject;
    }

    valueOf() {
        const { object: { position, color: { r, g, b, a = 1 } } } = this;

        return `colorStop::p:${position}:r:${r}:g:${g}:b:${b}:a:${a}`;
    }

    equals(other) {
        return other.object.position === this.object.position && other.object.color.equals(this.object.color);
    }

    toStyleValue({ colorFormat }, variables) {
        const { object: { position, color } } = this;
        let pos = "";

        if (position !== 1 && position) {
            pos = ` ${new Percent(position).toStyleValue()}`;
        }

        return `${new Color(color).toStyleValue({ colorFormat }, variables)}${pos}`;
    }
}

class Gradient {
    constructor(gradientObject) {
        this.object = gradientObject;
        this.colorStops = this.object.colorStops.map(cs => new ColorStop(cs));
    }

    static fromRGBA({ r, g, b, a = 1 }) {
        return new Gradient(
            new ExtensionGradient(
                generateColorGradient({ r, g, b, a }),
                100, 100 // eslint-disable-line no-magic-numbers
            )
        );
    }

    valueOf() {
        const { type, angle } = this.object;

        return `gradient::t:${type}:a:${angle}:${this.colorStops.map(cs => cs.valueOf()).join(":")}`;
    }

    equals(other) {
        return (
            this.object.type === other.object.type &&
            this.object.angle === other.object.angle &&
            this.colorStops.length === other.colorStops.length &&
            this.colorStops.every((cs, index) => cs.equals(other.colorStops[index]))
        );
    }

    toStyleValue({ colorFormat }, variables) {
        const { object: gradient } = this;
        const colorStopStyle = this.colorStops.map(cs => cs.toStyleValue({ colorFormat }, variables)).join(", ");

        switch (gradient.type) {
            case "linear":
                return `linear-gradient(${toCSSAngle(gradient.angle)}, ${colorStopStyle})`;

            case "radial":
                return `radial-gradient(circle at ${new Percent(gradient.from.x).toStyleValue()} ${new Percent(gradient.from.y).toStyleValue()}, ${colorStopStyle})`;

            case "angular":
                return `conic-gradient(${colorStopStyle}, ${this.colorStops[0].toStyleValue({ colorFormat }, variables)})`;

            default:
                return "";
        }
    }
}

export default Gradient;
import { Gradient as ExtensionGradient } from "@zeplin/extension-model";

import LinearGradient from "./linearGradient";
import RadialGradient from "./radialGradient";
import ConicGradient from "./conicGradient";

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

const GRADIENT_TYPE = Object.freeze({
    LINEAR: "linear",
    RADIAL: "radial",
    ANGULAR: "angular"
});

class Gradient {
    constructor(gradientObject, width, height) {
        const {
            type,
            from,
            to,
            colorStops
        } = gradientObject;

        this.type = type;

        switch (type) {
            case GRADIENT_TYPE.LINEAR:
                this.gradient = new LinearGradient(colorStops, from, to, width, height);
                break;

            case "radial":
                this.gradient = new RadialGradient(colorStops, from, to, width, height);
                break;

            case "angular":
                this.gradient = new ConicGradient(colorStops);
                break;

            default:
                // No-op
        }
    }

    static fromRGBA({ r, g, b, a = 1 }) {
        return new Gradient(
            new ExtensionGradient(
                generateColorGradient({ r, g, b, a }),
                100, 100 // eslint-disable-line no-magic-numbers
            ),
            100, 100 // eslint-disable-line no-magic-numbers
        );
    }

    valueOf() {
        const { type, gradient } = this;

        return `gradient::t:${type}:g:${gradient.valueOf()}`;
    }

    equals(other) {
        return this.type === other.type && this.gradient.equals(other.gradient);
    }

    toStyleValue({ colorFormat }, variables) {
        const { gradient } = this;

        if (gradient) {
            return gradient.toStyleValue({ colorFormat }, variables);
        }

        return "";
    }
}

export default Gradient;

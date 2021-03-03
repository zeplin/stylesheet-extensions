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

const FRAME_SIZE = 100;

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

            case GRADIENT_TYPE.RADIAL:
                this.gradient = new RadialGradient(colorStops, from, to, width, height);
                break;

            case GRADIENT_TYPE.ANGULAR:
                this.gradient = new ConicGradient(colorStops);
                break;

            default:
                // No-op
        }
    }

    static fromRGBA({ r, g, b, a = 1 }) {
        return new Gradient(
            new ExtensionGradient(generateColorGradient({ r, g, b, a }), FRAME_SIZE, FRAME_SIZE),
            FRAME_SIZE, FRAME_SIZE
        );
    }

    valueOf() {
        const { type, gradient } = this;

        return `gradient::t:${type}:g:${gradient.valueOf()}`;
    }

    equals(other) {
        return this.type === other.type && this.gradient.equals(other.gradient);
    }

    toStyleValue({ colorFormat }, container, formatColorVariable) {
        const { gradient } = this;

        if (gradient) {
            return gradient.toStyleValue({ colorFormat }, container, formatColorVariable);
        }

        return "";
    }
}

export default Gradient;

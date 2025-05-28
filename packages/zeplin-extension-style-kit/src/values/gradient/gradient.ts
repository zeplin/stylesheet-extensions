import { ColorNameResolver, ColorParams, StyleValue } from "../../common";
import { Gradient as ExtensionGradient } from "@zeplin/extension-model";
import { LinearGradient } from "./linearGradient";
import { RadialGradient } from "./radialGradient";
import { ConicGradient } from "./conicGradient";

export interface RGBAColor {
    r: number;
    g: number;
    b: number;
    a: number;
}

export interface Point {
    x: number;
    y: number;
}

export interface GradientColorStop {
    color: RGBAColor;
    position: number;
}

export type GradientType = "linear" | "radial" | "angular";

export interface GradientOptions {
    type: GradientType;
    from: Point;
    to: Point;
    width?: number;
    height?: number;
    colorStops: GradientColorStop[];
    repeating?: boolean;
}

function generateColorGradient({ r, g, b, a }: RGBAColor): GradientOptions {
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

const FRAME_SIZE = 100;

export class Gradient implements StyleValue {
    private gradient?: StyleValue;
    private type: GradientType;

    constructor(options: ExtensionGradient, width: number, height: number) {
        const { type, from, to, colorStops } = options;
        this.type = type;

        // Import gradient types dynamically to avoid circular dependencies
        switch (type) {
            case "linear": {
                this.gradient = new LinearGradient(colorStops, from, to, width, height);
                break;
            }
            case "radial": {
                this.gradient = new RadialGradient(colorStops, from, to, width, height);
                break;
            }
            case "angular": {
                this.gradient = new ConicGradient(colorStops);
                break;
            }
            default:
            // No-op
        }
    }

    static fromRGBA({ r, g, b, a = 1 }: RGBAColor) {
        return new Gradient(
            new ExtensionGradient(generateColorGradient({ r, g, b, a }), FRAME_SIZE, FRAME_SIZE),
            FRAME_SIZE, FRAME_SIZE
        );
    }

    valueOf() {
        const { type, gradient } = this;

        return `gradient::t:${type}:g:${gradient?.valueOf()}`;
    }

    equals(other: Gradient): boolean {
        if (!this.gradient || !other.gradient) {
            return false;
        }

        return this.type === other.type && this.gradient.equals(other.gradient);
    }

    toStyleValue(params: ColorParams, colorNameResolver: ColorNameResolver): string {
        const { gradient } = this;

        if (gradient) {
            return gradient.toStyleValue(params, colorNameResolver);
        }

        return "";
    }

    getType(): GradientType {
        return this.type;
    }
}

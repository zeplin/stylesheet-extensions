import { Gradient as GradientModel } from "@zeplin/extension-model";

const GRADIENT_DATA = {
    type: "linear",
    from: {
        x: 0.5,
        y: 0
    },
    to: {
        x: 0.5,
        y: 1
    },
    colorStops: [
        {
            color: {
                r: 255,
                g: 255,
                b: 255,
                a: 0.5
            },
            position: 0
        },
        {
            color: {
                r: 0,
                g: 0,
                b: 0,
                a: 0.5
            },
            position: 1
        }
    ]
};

export default function generateGradientObject(patch) {
    const gradientData = Object.assign({}, GRADIENT_DATA, patch);

    return new GradientModel(gradientData, 100, 100);
}
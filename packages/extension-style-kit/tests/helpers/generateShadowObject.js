import { Shadow as ShadowModel } from "@zeplin/extension-model";

const SHADOW_DATA = {
    type: "outer",
    offsetX: 0,
    offsetY: 2,
    blurRadius: 4,
    spread: 6,
    color: {
        r: 0,
        g: 0,
        b: 0,
        a: 0.5
    }
};

export default function generateShadowObject(patch) {
    const gradientData = Object.assign({}, SHADOW_DATA, patch);

    return new ShadowModel(gradientData, 100, 100);
}
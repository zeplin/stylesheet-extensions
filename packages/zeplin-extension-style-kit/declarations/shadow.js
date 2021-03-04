import Color from "../values/color";
import Length from "../values/length";
import { STYLE_PROPS } from "../constants";

function compareShadow(s1, s2) {
    return (
        s1.offsetX === s2.offsetX &&
        s1.offsetY === s2.offsetY &&
        s1.blurRadius === s2.blurRadius &&
        s1.color.equals(s2.color)
    );
}

class Shadow {
    constructor(shadowObjects, type) {
        this.objects = shadowObjects;
        this.type = type;
    }

    static generateTextShadow(shadow, { densityDivisor, colorFormat }, colorNameResolver) {
        return `${new Length(shadow.offsetX).toStyleValue({ densityDivisor })} ${
            new Length(shadow.offsetY).toStyleValue({ densityDivisor })} ${
            new Length(shadow.blurRadius).toStyleValue({ densityDivisor })} ${
            new Color(shadow.color).toStyleValue({ colorFormat }, colorNameResolver)}`;
    }

    static generateBoxShadow(shadow, { densityDivisor, colorFormat }, colorNameResolver) {
        return `${(shadow.type === "inner" ? "inset " : "") +
            new Length(shadow.offsetX).toStyleValue({ densityDivisor })} ${
            new Length(shadow.offsetY).toStyleValue({ densityDivisor })} ${
            new Length(shadow.blurRadius).toStyleValue({ densityDivisor })} ${
            new Length(shadow.spread).toStyleValue({ densityDivisor })} ${
            new Color(shadow.color).toStyleValue({ colorFormat }, colorNameResolver)}`;
    }

    get name() {
        return this.type === Shadow.TYPES.TEXT ? STYLE_PROPS.TEXT_SHADOW : STYLE_PROPS.BOX_SHADOW;
    }

    equals(other) {
        return (
            this.type === other.type &&
            this.objects.length === other.objects.length &&
            this.objects.every((s, index) => compareShadow(s, other.objects[index]))
        );
    }

    getValue(params, colorNameResolver) {
        const { objects: shadows, type } = this;

        if (type === Shadow.TYPES.TEXT) {
            return shadows.map(s => Shadow.generateTextShadow(s, params, colorNameResolver)).join(", ");
        }

        return shadows.map(s => Shadow.generateBoxShadow(s, params, colorNameResolver)).join(", ");
    }
}

Shadow.TYPES = Object.freeze({
    TEXT: "text",
    BOX: "box"
});

export default Shadow;

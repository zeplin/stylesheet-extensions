import { Length } from "../values/length";
import { STYLE_PROPS } from "../constants";
import { ColorNameResolver, ColorParams, LengthParams, StyleDeclaration } from "../common";
import { Color as ExtensionColor } from "@zeplin/extension-model";
import { Color } from "../values";

interface ShadowObject {
    offsetX: number;
    offsetY: number;
    blurRadius: number;
    color: ExtensionColor;
    spread: number;
    type?: string;
}

function compareShadow(s1: ShadowObject, s2: ShadowObject): boolean {
    return (
        s1.offsetX === s2.offsetX &&
        s1.offsetY === s2.offsetY &&
        s1.blurRadius === s2.blurRadius &&
        s1.color.equals(s2.color)
    );
}

const TYPES = Object.freeze({
    TEXT: "text",
    BOX: "box"
});

export class Shadow implements StyleDeclaration {
    private objects: ShadowObject[];
    private type: string;

    constructor(shadowObjects: ShadowObject[], type: string) {
        this.objects = shadowObjects;
        this.type = type;
    }

    private static generateTextShadow(shadow: ShadowObject, {
        densityDivisor,
        colorFormat
    }: LengthParams & ColorParams, colorNameResolver: ColorNameResolver): string {
        return `${new Length(shadow.offsetX).toStyleValue({ densityDivisor })} ${
            new Length(shadow.offsetY).toStyleValue({ densityDivisor })} ${
            new Length(shadow.blurRadius).toStyleValue({ densityDivisor })} ${
            new Color(shadow.color).toStyleValue({ colorFormat }, colorNameResolver)}`;
    }

    private static generateBoxShadow(shadow: ShadowObject, {
        densityDivisor,
        colorFormat
    }: LengthParams & ColorParams, colorNameResolver: ColorNameResolver): string {
        return `${(shadow.type === "inner" ? "inset " : "") +
        new Length(shadow.offsetX).toStyleValue({ densityDivisor })} ${
            new Length(shadow.offsetY).toStyleValue({ densityDivisor })} ${
            new Length(shadow.blurRadius).toStyleValue({ densityDivisor })} ${
            new Length(shadow.spread).toStyleValue({ densityDivisor })} ${
            new Color(shadow.color).toStyleValue({ colorFormat }, colorNameResolver)}`;
    }

    get name(): string {
        return this.type === Shadow.TYPES.TEXT ? STYLE_PROPS.TEXT_SHADOW : STYLE_PROPS.BOX_SHADOW;
    }

    static get TYPES(): typeof TYPES {
        return TYPES;
    }

    equals(other: Shadow): boolean {
        return (
            this.type === other.type &&
            this.objects.length === other.objects.length &&
            this.objects.every((s, index) => compareShadow(s, other.objects[index]))
        );
    }

    getValue(params: LengthParams & ColorParams, colorNameResolver: ColorNameResolver): string {
        const generator = this.type === Shadow.TYPES.TEXT
            ? Shadow.generateTextShadow
            : Shadow.generateBoxShadow;

        return this.objects
            .map(shadow => generator(shadow, params, colorNameResolver))
            .join(", ");
    }
}


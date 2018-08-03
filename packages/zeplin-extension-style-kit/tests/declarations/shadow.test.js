import Shadow from "@root/declarations/shadow";

import generateShadowObject from "@testHelpers/generateShadowObject";

import Color from "@root/values/color";
import Length from "@root/values/length";

test("property name (text)", () => {
    const shadow = new Shadow([generateShadowObject()], Shadow.TYPES.TEXT);

    expect(shadow.name).toBe("text-shadow");
});

test("property name (box)", () => {
    const shadow = new Shadow([generateShadowObject()], Shadow.TYPES.BOX);

    expect(shadow.name).toBe("box-shadow");
});

test("shadow value (text)", () => {
    const params = { densityDivisor: 2, colorFormat: "hex" };
    const offsetX = 0;
    const offsetY = 2;
    const blurRadius = 4;
    const color = { r: 0, g: 255, b: 0, a: 1 };

    const shadow = new Shadow([generateShadowObject({
        offsetX,
        offsetY,
        blurRadius,
        color
    })], Shadow.TYPES.TEXT);

    expect(shadow.getValue(params))
        .toBe(`${new Length(offsetX).toStyleValue(params)} ${new Length(offsetY).toStyleValue(params)} ${new Length(blurRadius).toStyleValue(params)} ${Color.fromRGBA(color).toStyleValue(params)}`);
});

test("shadow value (box-outer)", () => {
    const params = { densityDivisor: 2, colorFormat: "hex" };
    const offsetX = 0;
    const offsetY = 2;
    const spread = 6;
    const blurRadius = 4;
    const color = { r: 0, g: 255, b: 0, a: 1 };

    const shadow = new Shadow([generateShadowObject({
        type: "outer",
        offsetX,
        offsetY,
        blurRadius,
        spread,
        color
    })], Shadow.TYPES.BOX);

    expect(shadow.getValue(params))
        .toBe(`${new Length(offsetX).toStyleValue(params)} ${new Length(offsetY).toStyleValue(params)} ${new Length(blurRadius).toStyleValue(params)} ${new Length(spread).toStyleValue(params)} ${Color.fromRGBA(color).toStyleValue(params)}`);
});

test("shadow value (box-inner)", () => {
    const params = { densityDivisor: 2, colorFormat: "hex" };
    const offsetX = 0;
    const offsetY = 2;
    const spread = 6;
    const blurRadius = 4;
    const color = { r: 0, g: 255, b: 0, a: 1 };

    const shadow = new Shadow([generateShadowObject({
        type: "inner",
        offsetX,
        offsetY,
        blurRadius,
        spread,
        color
    })], Shadow.TYPES.BOX);

    expect(shadow.getValue(params))
        .toBe(`inset ${new Length(offsetX).toStyleValue(params)} ${new Length(offsetY).toStyleValue(params)} ${new Length(blurRadius).toStyleValue(params)} ${new Length(spread).toStyleValue(params)} ${Color.fromRGBA(color).toStyleValue(params)}`);
});

test("equality check", () => {
    const shadow = new Shadow([generateShadowObject()], Shadow.TYPES.BOX);
    const other = new Shadow([generateShadowObject()], Shadow.TYPES.BOX);

    expect(shadow.equals(other)).toBe(true);
});

test("equality check (unequal - different type)", () => {
    const shadow = new Shadow([generateShadowObject()], Shadow.TYPES.TEXT);
    const other = new Shadow([generateShadowObject()], Shadow.TYPES.BOX);

    expect(shadow.equals(other)).toBe(false);
});

test("equality check (unequal - different type)", () => {
    const shadow = new Shadow([generateShadowObject()], Shadow.TYPES.TEXT);
    const other = new Shadow([generateShadowObject()], Shadow.TYPES.BOX);

    expect(shadow.equals(other)).toBe(false);
});

test("equality check (unequal - different params)", () => {
    const shadow = new Shadow([generateShadowObject({ offsetX: 1, offsetY: 3, blurRadius: 5 })], Shadow.TYPES.TEXT);
    const other = new Shadow([generateShadowObject({ offsetX: 2, offsetY: 4, blurRadius: 6 })], Shadow.TYPES.TEXT);

    expect(shadow.equals(other)).toBe(false);
});

test("equality check (unequal - different number of shadows)", () => {
    const shadow = new Shadow([generateShadowObject()], Shadow.TYPES.TEXT);
    const other = new Shadow([generateShadowObject(), generateShadowObject({ blurRadius: 16 })], Shadow.TYPES.TEXT);

    expect(shadow.equals(other)).toBe(false);
});
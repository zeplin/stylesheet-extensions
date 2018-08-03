import LineHeight from "@root/declarations/lineHeight";

import Length from "@root/values/length";
import Scalar from "@root/values/scalar";

test("property name", () => {
    const lineHeight = new LineHeight(new Length(1));

    expect(lineHeight.name).toBe("line-height");
});

test("line-height value", () => {
    const params = { unitlessLineHeight: false, densityDivisor: 2 };
    const lineHeightValue = 18;
    const fontSize = 16;
    const lineHeight = new LineHeight(lineHeightValue, fontSize);

    expect(lineHeight.getValue(params)).toBe(`${lineHeightValue / params.densityDivisor}px`);
});

test("unitless line-height value", () => {
    const params = { unitlessLineHeight: true, densityDivisor: 2 };
    const lineHeightValue = 18;
    const fontSize = 16;
    const lineHeight = new LineHeight(lineHeightValue, fontSize);

    expect(lineHeight.getValue(params)).toBe(new Scalar(lineHeightValue / fontSize).toStyleValue());
});

test("has default value", () => {
    const lineHeight = new LineHeight(LineHeight.DEFAULT_VALUE);

    expect(lineHeight.hasDefaultValue()).toBe(true);
});

test("not have default value", () => {
    const lineHeight = new LineHeight(18, 16);

    expect(lineHeight.hasDefaultValue()).toBe(false);
});

test("equality check", () => {
    const lineHeight = new LineHeight(18, 16);
    const other = new LineHeight(18, 16);

    expect(lineHeight.equals(other)).toBe(true);
});

test("equality check (unequal)", () => {
    const lineHeight = new LineHeight(18, 16);
    const other = new LineHeight(28, 16);

    expect(lineHeight.equals(other)).toBe(false);
});

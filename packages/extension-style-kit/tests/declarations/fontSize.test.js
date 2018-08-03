import FontSize from "@root/declarations/fontSize";

import Length from "@root/values/length";

test("property name", () => {
    const fontSize = new FontSize(new Length(1));

    expect(fontSize.name).toBe("font-size");
});

test("font-size value", () => {
    const params = { densityDivisor: 2 };
    const size = 2;
    const fontSize = new FontSize(new Length(size, "px"));

    expect(fontSize.getValue(params)).toBe(`${size / params.densityDivisor}px`);
});

test("has default value", () => {
    const fontSize = new FontSize(FontSize.DEFAULT_VALUE);

    expect(fontSize.hasDefaultValue()).toBe(true);
});

test("not have default value", () => {
    const fontSize = new FontSize(new Length(13));

    expect(fontSize.hasDefaultValue()).toBe(false);
});

test("equality check", () => {
    const fontSize = new FontSize(new Length(10));
    const other = new FontSize(new Length(10));

    expect(fontSize.equals(other)).toBe(true);
});

test("equality check (unequal)", () => {
    const fontSize = new FontSize(new Length(10));
    const other = new FontSize(new Length(20));

    expect(fontSize.equals(other)).toBe(false);
});

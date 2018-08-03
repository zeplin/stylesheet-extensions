import BorderWidth from "@root/declarations/borderWidth";

import Length from "@root/values/length";

test("property name", () => {
    const borderWidth = new BorderWidth(new Length(1));

    expect(borderWidth.name).toBe("border-width");
});

test("border-width value", () => {
    const params = { densityDivisor: 2 };
    const width = 2;
    const borderWidth = new BorderWidth(new Length(width, "px"));

    expect(borderWidth.getValue(params)).toBe(`${width / params.densityDivisor}px`);
});

test("equality check", () => {
    const borderWidth = new BorderWidth(new Length(10));
    const other = new BorderWidth(new Length(10));

    expect(borderWidth.equals(other)).toBe(true);
});

test("equality check (unequal)", () => {
    const borderWidth = new BorderWidth(new Length(10));
    const other = new BorderWidth(new Length(20));

    expect(borderWidth.equals(other)).toBe(false);
});

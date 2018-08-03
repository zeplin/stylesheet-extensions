import Width from "@root/declarations/width";

import Length from "@root/values/length";

test("property name", () => {
    const width = new Width(new Length(1));

    expect(width.name).toBe("width");
});

test("width value", () => {
    const params = { densityDivisor: 2 };
    const widthValue = 2;
    const width = new Width(new Length(widthValue, "px"));

    expect(width.getValue(params)).toBe(`${widthValue / params.densityDivisor}px`);
});

test("equality check", () => {
    const width = new Width(new Length(10));
    const other = new Width(new Length(10));

    expect(width.equals(other)).toBe(true);
});

test("equality check (unequal)", () => {
    const width = new Width(new Length(10));
    const other = new Width(new Length(20));

    expect(width.equals(other)).toBe(false);
});

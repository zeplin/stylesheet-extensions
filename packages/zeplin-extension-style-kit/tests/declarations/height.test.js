import Height from "@root/declarations/height";

import Length from "@root/values/length";

test("property name", () => {
    const height = new Height(new Length(1));

    expect(height.name).toBe("height");
});

test("height value", () => {
    const params = { densityDivisor: 2 };
    const heightValue = 2;
    const height = new Height(new Length(heightValue, "px"));

    expect(height.getValue(params)).toBe(`${heightValue / params.densityDivisor}px`);
});

test("equality check", () => {
    const height = new Height(new Length(10));
    const other = new Height(new Length(10));

    expect(height.equals(other)).toBe(true);
});

test("equality check (unequal)", () => {
    const height = new Height(new Length(10));
    const other = new Height(new Length(20));

    expect(height.equals(other)).toBe(false);
});

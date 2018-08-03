import BorderRadius from "@root/declarations/borderRadius";

import Length from "@root/values/length";

test("property name", () => {
    const borderRadius = new BorderRadius(new Length(1));

    expect(borderRadius.name).toBe("border-radius");
});

test("border radius value", () => {
    const params = { densityDivisor: 2 };
    const radius = 20;
    const borderRadius = new BorderRadius(new Length(radius, "px"));

    expect(borderRadius.getValue(params)).toBe(`${radius / params.densityDivisor}px`);
});

test("equality check", () => {
    const borderRadius = new BorderRadius(new Length(10));
    const other = new BorderRadius(new Length(10));

    expect(borderRadius.equals(other)).toBe(true);
});

test("equality check (unequal)", () => {
    const borderRadius = new BorderRadius(new Length(10));
    const other = new BorderRadius(new Length(20));

    expect(borderRadius.equals(other)).toBe(false);
});

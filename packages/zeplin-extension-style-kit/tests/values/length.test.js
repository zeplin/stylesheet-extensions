import { Length } from "@root/values/length";

test("default unit is px", () => {
    const length = new Length(13);

    expect(length.toStyleValue({ densityDivisor: 1 })).toBe("13px");
});

test("decimal number precision is 1", () => {
    const length = new Length(13.21);

    expect(length.toStyleValue({ densityDivisor: 1 })).toBe("13.2px");
});

test("density divisor divides the value", () => {
    const length = new Length(30);

    expect(length.toStyleValue({ densityDivisor: 2 })).toBe("15px");
});

test("calculates rem", () => {
    const length = new Length(30, { useRemUnit: true });

    expect(length.toStyleValue({ densityDivisor: 1, remPreferences: { rootFontSize: 15 } })).toBe("2rem");
});

test("zero is unitless", () => {
    const pc = new Length(0);

    expect(pc.toStyleValue({ densityDivisor: 1 })).toBe("0");
});

test("equality check returns true if value and unit are equal", () => {
    const length = new Length(13);
    const other = new Length(13);

    expect(length.equals(other)).toBe(true);
});

import Angle from "@root/values/angle";

test("default unit is deg", () => {
    const angle = new Angle(13);

    expect(angle.toStyleValue({ densityDivisor: 1 })).toBe("13deg");
});

test("angle with specific unit", () => {
    const angle = new Angle(3, "rad");

    expect(angle.toStyleValue({ densityDivisor: 1 })).toBe("3rad");
});

test("zero is unitless", () => {
    const pc = new Angle(0);

    expect(pc.toStyleValue({ densityDivisor: 1 })).toBe("0");
});

test("equality check returns true if value and unit are equal", () => {
    const angle = new Angle(13);
    const other = new Angle(13);

    expect(angle.equals(other)).toBe(true);
});

test("equality check returns false if value does not match", () => {
    const angle = new Angle(13);
    const other = new Angle(13, "rad");

    expect(angle.equals(other)).toBe(false);
});
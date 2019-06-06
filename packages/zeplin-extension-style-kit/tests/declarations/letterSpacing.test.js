import LetterSpacing from "@root/declarations/letterSpacing";

import Length from "@root/values/length";

test("property name", () => {
    const letterSpacing = new LetterSpacing(new Length(1));

    expect(letterSpacing.name).toBe("letter-spacing");
});

test("letter-spacing value", () => {
    const params = { densityDivisor: 2 };
    const value = 2;
    const letterSpacing = new LetterSpacing(value);

    expect(letterSpacing.getValue(params)).toBe(`${value / params.densityDivisor}px`);
});

test("has default value", () => {
    const letterSpacing = new LetterSpacing(LetterSpacing.DEFAULT_VALUE);

    expect(letterSpacing.hasDefaultValue()).toBe(true);
});

test("not have default value", () => {
    const letterSpacing = new LetterSpacing(13);

    expect(letterSpacing.hasDefaultValue()).toBe(false);
});

test("has decimal value", () => {
    const params = { densityDivisor: 2 };
    const value = 0.04;
    const letterSpacing = new LetterSpacing(value);

    expect(letterSpacing.getValue(params)).toBe(`${value / params.densityDivisor}px`);
});

test("equality check", () => {
    const value = 10;
    const letterSpacing = new LetterSpacing(value);
    const other = new LetterSpacing(value);

    expect(letterSpacing.equals(other)).toBe(true);
});

test("equality check (unequal)", () => {
    const value = 10;
    const letterSpacing = new LetterSpacing(value);

    const otherValue = 20;
    const other = new LetterSpacing(otherValue);

    expect(letterSpacing.equals(other)).toBe(false);
});

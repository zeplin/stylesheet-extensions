import LetterSpacing from "@root/declarations/letterSpacing";

import Length from "@root/values/length";

test("property name", () => {
    const letterSpacing = new LetterSpacing(new Length(1));

    expect(letterSpacing.name).toBe("letter-spacing");
});

test("letter-spacing value", () => {
    const params = { densityDivisor: 2 };
    const size = 2;
    const letterSpacing = new LetterSpacing(new Length(size, "px"));

    expect(letterSpacing.getValue(params)).toBe(`${size / params.densityDivisor}px`);
});

test("has default value", () => {
    const letterSpacing = new LetterSpacing(LetterSpacing.DEFAULT_VALUE);

    expect(letterSpacing.hasDefaultValue()).toBe(true);
});

test("not have default value", () => {
    const letterSpacing = new LetterSpacing(new Length(13));

    expect(letterSpacing.hasDefaultValue()).toBe(false);
});

test("equality check", () => {
    const letterSpacing = new LetterSpacing(new Length(10));
    const other = new LetterSpacing(new Length(10));

    expect(letterSpacing.equals(other)).toBe(true);
});

test("equality check (unequal)", () => {
    const letterSpacing = new LetterSpacing(new Length(10));
    const other = new LetterSpacing(new Length(20));

    expect(letterSpacing.equals(other)).toBe(false);
});

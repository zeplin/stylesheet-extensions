import FontFamily from "@root/declarations/fontFamily";

test("property name", () => {
    const fontFamily = new FontFamily("Helvetica");

    expect(fontFamily.name).toBe("font-family");
});

test("font-family value", () => {
    const fontFamily = new FontFamily("Helvetica");

    expect(fontFamily.getValue()).toBe("Helvetica");
});

test("equality check", () => {
    const fontFamily = new FontFamily("Helvetica");
    const other = new FontFamily("Helvetica");

    expect(fontFamily.equals(other)).toBe(true);
});

test("equality check (unequal)", () => {
    const fontFamily = new FontFamily("Helvetica");
    const other = new FontFamily("Arial");

    expect(fontFamily.equals(other)).toBe(false);
});
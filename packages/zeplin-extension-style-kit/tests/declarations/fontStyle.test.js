import FontStyle from "@root/declarations/fontStyle";

test("property name", () => {
    const fontStyle = new FontStyle("italic");

    expect(fontStyle.name).toBe("font-style");
});

test("font-style value", () => {
    const fontStyle = new FontStyle("italic");

    expect(fontStyle.getValue()).toBe("italic");
});

test("has default value", () => {
    const fontStyle = new FontStyle(FontStyle.DEFAULT_VALUE);

    expect(fontStyle.hasDefaultValue()).toBe(true);
});

test("not have default value", () => {
    const fontStyle = new FontStyle("italic");

    expect(fontStyle.hasDefaultValue()).toBe(false);
});

test("equality check", () => {
    const fontStyle = new FontStyle("italic");
    const other = new FontStyle("italic");

    expect(fontStyle.equals(other)).toBe(true);
});

test("equality check (unequal)", () => {
    const fontStyle = new FontStyle("italic");
    const other = new FontStyle("oblique");

    expect(fontStyle.equals(other)).toBe(false);
});
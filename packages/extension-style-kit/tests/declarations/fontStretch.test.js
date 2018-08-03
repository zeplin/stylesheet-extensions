import FontStretch from "@root/declarations/fontStretch";

test("property name", () => {
    const fontStretch = new FontStretch("condensed");

    expect(fontStretch.name).toBe("font-stretch");
});

test("font-stretch value", () => {
    const fontStretch = new FontStretch("condensed");

    expect(fontStretch.getValue()).toBe("condensed");
});

test("has default value", () => {
    const fontStretch = new FontStretch(FontStretch.DEFAULT_VALUE);

    expect(fontStretch.hasDefaultValue()).toBe(true);
});

test("not have default value", () => {
    const fontStretch = new FontStretch("condensed");

    expect(fontStretch.hasDefaultValue()).toBe(false);
});

test("equality check", () => {
    const fontStretch = new FontStretch("condensed");
    const other = new FontStretch("condensed");

    expect(fontStretch.equals(other)).toBe(true);
});

test("equality check (unequal)", () => {
    const fontStretch = new FontStretch("condensed");
    const other = new FontStretch("expanded");

    expect(fontStretch.equals(other)).toBe(false);
});
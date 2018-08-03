import FontWeight from "@root/declarations/fontWeight";

test("property name", () => {
    const fontWeight = new FontWeight(300);

    expect(fontWeight.name).toBe("font-weight");
});

test("font-weight value", () => {
    const fontWeight = new FontWeight(300);

    expect(fontWeight.getValue()).toBe(300);
});

test("has default value", () => {
    const fontWeight = new FontWeight(FontWeight.DEFAULT_VALUE);

    expect(fontWeight.hasDefaultValue()).toBe(true);
});

test("not have default value", () => {
    const fontWeight = new FontWeight(300);

    expect(fontWeight.hasDefaultValue()).toBe(false);
});

test("400 is normal", () => {
    const fontWeight = new FontWeight(400);

    expect(fontWeight.getValue()).toBe("normal");
});

test("700 is bold", () => {
    const fontWeight = new FontWeight(700);

    expect(fontWeight.getValue()).toBe("bold");
});

test("equality check", () => {
    const fontWeight = new FontWeight(300);
    const other = new FontWeight(300);

    expect(fontWeight.equals(other)).toBe(true);
});

test("equality check (unequal)", () => {
    const fontWeight = new FontWeight(300);
    const other = new FontWeight(400);

    expect(fontWeight.equals(other)).toBe(false);
});
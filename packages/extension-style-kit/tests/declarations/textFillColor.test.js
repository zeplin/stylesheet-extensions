import TextFillColor from "@root/declarations/textFillColor";

test("property name", () => {
    const textFillColor = new TextFillColor("transparent");

    expect(textFillColor.name).toBe("-webkit-text-fill-color");
});

test("text-fill-color value", () => {
    const textFillColor = new TextFillColor("transparent");

    expect(textFillColor.getValue()).toBe("transparent");
});

test("equality check", () => {
    const textFillColor = new TextFillColor("transparent");
    const other = new TextFillColor("transparent");

    expect(textFillColor.equals(other)).toBe(true);
});

test("equality check (unequal)", () => {
    const textFillColor = new TextFillColor("transparent");
    const other = new TextFillColor("red");

    expect(textFillColor.equals(other)).toBe(false);
});
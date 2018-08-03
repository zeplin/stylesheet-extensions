import TextAlign from "@root/declarations/textAlign";

test("property name", () => {
    const textAlign = new TextAlign("left");

    expect(textAlign.name).toBe("text-align");
});

test("text-align value", () => {
    const textAlign = new TextAlign("right");

    expect(textAlign.getValue()).toBe("right");
});

test("equality check", () => {
    const textAlign = new TextAlign("right");
    const other = new TextAlign("right");

    expect(textAlign.equals(other)).toBe(true);
});

test("equality check (unequal)", () => {
    const textAlign = new TextAlign("right");
    const other = new TextAlign("center");

    expect(textAlign.equals(other)).toBe(false);
});
import BorderStyle from "@root/declarations/borderStyle";

test("property name", () => {
    const borderStyle = new BorderStyle("dashed");

    expect(borderStyle.name).toBe("border-style");
});

test("border-style value", () => {
    const borderStyle = new BorderStyle("solid");

    expect(borderStyle.getValue()).toBe("solid");
});

test("equality check", () => {
    const borderStyle = new BorderStyle("dashed");
    const other = new BorderStyle("dashed");

    expect(borderStyle.equals(other)).toBe(true);
});

test("equality check (unequal)", () => {
    const borderStyle = new BorderStyle("dashed");
    const other = new BorderStyle("solid");

    expect(borderStyle.equals(other)).toBe(false);
});
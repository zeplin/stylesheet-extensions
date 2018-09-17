import BackgroundOrigin from "@root/declarations/backgroundOrigin";

test("property name", () => {
    const origin = new BackgroundOrigin(["border-box"]);

    expect(origin.name).toBe("background-origin");
});

test("background-origin value", () => {
    const origin = new BackgroundOrigin(["border-box", "content-box"]);

    expect(origin.getValue()).toBe("border-box, content-box");
});

test("equality check", () => {
    const origin = new BackgroundOrigin(["border-box"]);
    const other = new BackgroundOrigin(["border-box"]);

    expect(origin.equals(other)).toBe(true);
});

test("equality check (unequal)", () => {
    const origin = new BackgroundOrigin(["border-box"]);
    const other = new BackgroundOrigin(["content-box"]);

    expect(origin.equals(other)).toBe(false);
});
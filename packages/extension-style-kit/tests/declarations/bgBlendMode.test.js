import BgBlendMode from "@root/declarations/bgBlendMode";

test("property name", () => {
    const backdropFilter = new BgBlendMode(["lighten"]);

    expect(backdropFilter.name).toBe("background-blend-mode");
});

test("single blend mode", () => {
    const backdropFilter = new BgBlendMode(["lighten"]);

    expect(backdropFilter.getValue()).toBe("lighten");
});

test("multiple blend modes", () => {
    const backdropFilter = new BgBlendMode(["color-burn", "lighten"]);

    expect(backdropFilter.getValue()).toBe("color-burn, lighten");
});

test("equality check", () => {
    const backdropFilter = new BgBlendMode(["color-burn", "lighten"]);
    const other = new BgBlendMode(["color-burn", "lighten"]);

    expect(backdropFilter.equals(other)).toBe(true);
});

test("equality check (order matters)", () => {
    const backdropFilter = new BgBlendMode(["color-burn", "lighten"]);
    const other = new BgBlendMode(["lighten", "color-burn"]);

    expect(backdropFilter.equals(other)).toBe(false);
});

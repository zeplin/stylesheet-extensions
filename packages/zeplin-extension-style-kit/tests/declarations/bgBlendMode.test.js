import BackgroundBlendMode from "@root/declarations/backgroundBlendMode";

test("property name", () => {
    const backdropFilter = new BackgroundBlendMode(["lighten"]);

    expect(backdropFilter.name).toBe("background-blend-mode");
});

test("single blend mode", () => {
    const backdropFilter = new BackgroundBlendMode(["lighten"]);

    expect(backdropFilter.getValue()).toBe("lighten");
});

test("multiple blend modes", () => {
    const backdropFilter = new BackgroundBlendMode(["color-burn", "lighten"]);

    expect(backdropFilter.getValue()).toBe("color-burn, lighten");
});

test("equality check", () => {
    const backdropFilter = new BackgroundBlendMode(["color-burn", "lighten"]);
    const other = new BackgroundBlendMode(["color-burn", "lighten"]);

    expect(backdropFilter.equals(other)).toBe(true);
});

test("equality check (order matters)", () => {
    const backdropFilter = new BackgroundBlendMode(["color-burn", "lighten"]);
    const other = new BackgroundBlendMode(["lighten", "color-burn"]);

    expect(backdropFilter.equals(other)).toBe(false);
});

import MixBlendMode from "@root/declarations/mixBlendMode";

test("property name", () => {
    const clip = new MixBlendMode("multiply");

    expect(clip.name).toBe("mix-blend-mode");
});

test("mix-blend-mode value", () => {
    const clip = new MixBlendMode("multiply");

    expect(clip.getValue()).toBe("multiply");
});

test("equality check", () => {
    const clip = new MixBlendMode("multiply");
    const other = new MixBlendMode("multiply");

    expect(clip.equals(other)).toBe(true);
});

test("equality check (unequal)", () => {
    const clip = new MixBlendMode("multiply");
    const other = new MixBlendMode("hard-light");

    expect(clip.equals(other)).toBe(false);
});
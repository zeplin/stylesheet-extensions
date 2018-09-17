import BackgroundClip from "@root/declarations/backgroundClip";

test("property name", () => {
    const clip = new BackgroundClip(["border-box"]);

    expect(clip.name).toBe("background-clip");
});

test("background-clip value", () => {
    const clip = new BackgroundClip(["border-box", "content-box"]);

    expect(clip.getValue()).toBe("border-box, content-box");
});

test("equality check", () => {
    const clip = new BackgroundClip(["border-box"]);
    const other = new BackgroundClip(["border-box"]);

    expect(clip.equals(other)).toBe(true);
});

test("equality check (unequal)", () => {
    const clip = new BackgroundClip(["border-box"]);
    const other = new BackgroundClip(["content-box"]);

    expect(clip.equals(other)).toBe(false);
});
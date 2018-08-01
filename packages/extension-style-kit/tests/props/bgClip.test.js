import BgClip from "@root/props/bgClip";

test("property name", () => {
    const clip = new BgClip(["border-box"]);

    expect(clip.name).toBe("background-clip");
});

test("background-clip value", () => {
    const clip = new BgClip(["border-box", "content-box"]);

    expect(clip.getValue()).toBe("border-box, content-box");
});

test("equality check", () => {
    const clip = new BgClip(["border-box"]);
    const other = new BgClip(["border-box"]);

    expect(clip.equals(other)).toBe(true);
});

test("equality check (unequal)", () => {
    const clip = new BgClip(["border-box"]);
    const other = new BgClip(["content-box"]);

    expect(clip.equals(other)).toBe(false);
});
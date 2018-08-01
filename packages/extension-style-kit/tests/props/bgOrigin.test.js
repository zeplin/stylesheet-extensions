import BgOrigin from "@root/props/bgOrigin";

test("property name", () => {
    const origin = new BgOrigin(["border-box"]);

    expect(origin.name).toBe("background-origin");
});

test("background-origin value", () => {
    const origin = new BgOrigin(["border-box", "content-box"]);

    expect(origin.getValue()).toBe("border-box, content-box");
});

test("equality check", () => {
    const origin = new BgOrigin(["border-box"]);
    const other = new BgOrigin(["border-box"]);

    expect(origin.equals(other)).toBe(true);
});

test("equality check (unequal)", () => {
    const origin = new BgOrigin(["border-box"]);
    const other = new BgOrigin(["content-box"]);

    expect(origin.equals(other)).toBe(false);
});
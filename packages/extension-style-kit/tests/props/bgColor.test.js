import BgColor from "@root/props/bgColor";

import Color from "@root/values/color";

test("property name", () => {
    const clip = new BgColor(Color.fromRGBA({ r: 255, g: 255, b: 0, a: 1 }));

    expect(clip.name).toBe("background-color");
});

test("background-color rgb value", () => {
    const bgColor = new BgColor(Color.fromRGBA({ r: 255, g: 255, b: 0, a: 1 }));

    expect(bgColor.getValue({ colorFormat: "hex" })).toBe("#ffff00");
});

test("background-color hsl value", () => {
    const bgColor = new BgColor(Color.fromRGBA({ r: 255, g: 255, b: 0, a: 1 }));

    expect(bgColor.getValue({ colorFormat: "hsl" })).toBe("hsl(60, 100%, 50%)");
});

test("variable as color value", () => {
    const bgColor = new BgColor(Color.fromRGBA({ r: 13, g: 13, b: 13, a: 1 }));
    const variables = {
        "#0d0d0d": "var(--cod_gray)"
    };

    expect(bgColor.getValue({ colorFormat: "hex" }, variables)).toBe("var(--cod_gray)");
});

test("equality check", () => {
    const bgColor = new BgColor(Color.fromRGBA({ r: 255, g: 255, b: 0, a: 1 }));
    const other = new BgColor(Color.fromRGBA({ r: 255, g: 255, b: 0, a: 1 }));

    expect(bgColor.equals(other)).toBe(true);
});

test("equality check (unequal)", () => {
    const bgColor = new BgColor(Color.fromRGBA({ r: 255, g: 255, b: 0, a: 1 }));
    const other = new BgColor(Color.fromRGBA({ r: 13, g: 13, b: 0, a: 0.1 }));

    expect(bgColor.equals(other)).toBe(false);
});
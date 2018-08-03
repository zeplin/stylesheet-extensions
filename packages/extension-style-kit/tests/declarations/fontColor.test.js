import FontColor from "@root/declarations/fontColor";

import Color from "@root/values/color";

test("property name", () => {
    const clip = new FontColor(Color.fromRGBA({ r: 255, g: 255, b: 0, a: 1 }));

    expect(clip.name).toBe("color");
});

test("background-color rgb value", () => {
    const fontColor = new FontColor(Color.fromRGBA({ r: 255, g: 255, b: 0, a: 1 }));

    expect(fontColor.getValue({ colorFormat: "hex" })).toBe("#ffff00");
});

test("background-color hsl value", () => {
    const fontColor = new FontColor(Color.fromRGBA({ r: 255, g: 255, b: 0, a: 1 }));

    expect(fontColor.getValue({ colorFormat: "hsl" })).toBe("hsl(60, 100%, 50%)");
});

test("variable as color value", () => {
    const fontColor = new FontColor(Color.fromRGBA({ r: 13, g: 13, b: 13, a: 1 }));
    const variables = {
        "#0d0d0d": "var(--cod_gray)"
    };

    expect(fontColor.getValue({ colorFormat: "hex" }, variables)).toBe("var(--cod_gray)");
});

test("has default value", () => {
    const fontColor = new FontColor(FontColor.DEFAULT_VALUE);

    expect(fontColor.hasDefaultValue()).toBe(true);
});

test("not have default value", () => {
    const fontColor = new FontColor(Color.fromRGBA({ r: 255, g: 255, b: 0, a: 1 }));

    expect(fontColor.hasDefaultValue()).toBe(false);
});

test("equality check", () => {
    const fontColor = new FontColor(Color.fromRGBA({ r: 255, g: 255, b: 0, a: 1 }));
    const other = new FontColor(Color.fromRGBA({ r: 255, g: 255, b: 0, a: 1 }));

    expect(fontColor.equals(other)).toBe(true);
});

test("equality check (unequal)", () => {
    const fontColor = new FontColor(Color.fromRGBA({ r: 255, g: 255, b: 0, a: 1 }));
    const other = new FontColor(Color.fromRGBA({ r: 13, g: 13, b: 0, a: 0.1 }));

    expect(fontColor.equals(other)).toBe(false);
});
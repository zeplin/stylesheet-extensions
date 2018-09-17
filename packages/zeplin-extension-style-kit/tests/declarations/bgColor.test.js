import BackgroundColor from "@root/declarations/backgroundColor";

import Color from "@root/values/color";

test("property name", () => {
    const clip = new BackgroundColor(Color.fromRGBA({ r: 255, g: 255, b: 0, a: 1 }));

    expect(clip.name).toBe("background-color");
});

test("background-color rgb value", () => {
    const backgroundColor = new BackgroundColor(Color.fromRGBA({ r: 255, g: 255, b: 0, a: 1 }));

    expect(backgroundColor.getValue({ colorFormat: "hex" })).toBe("#ffff00");
});

test("background-color hsl value", () => {
    const backgroundColor = new BackgroundColor(Color.fromRGBA({ r: 255, g: 255, b: 0, a: 1 }));

    expect(backgroundColor.getValue({ colorFormat: "hsl" })).toBe("hsl(60, 100%, 50%)");
});

test("variable as color value", () => {
    const color = Color.fromRGBA({ r: 13, g: 13, b: 13, a: 1 });
    const backgroundColor = new BackgroundColor(color);
    const variables = {
        [color.valueOf()]: "var(--cod_gray)"
    };

    expect(backgroundColor.getValue({ colorFormat: "hex" }, variables)).toBe("var(--cod_gray)");
});

test("equality check", () => {
    const backgroundColor = new BackgroundColor(Color.fromRGBA({ r: 255, g: 255, b: 0, a: 1 }));
    const other = new BackgroundColor(Color.fromRGBA({ r: 255, g: 255, b: 0, a: 1 }));

    expect(backgroundColor.equals(other)).toBe(true);
});

test("equality check (unequal)", () => {
    const backgroundColor = new BackgroundColor(Color.fromRGBA({ r: 255, g: 255, b: 0, a: 1 }));
    const other = new BackgroundColor(Color.fromRGBA({ r: 13, g: 13, b: 0, a: 0.1 }));

    expect(backgroundColor.equals(other)).toBe(false);
});
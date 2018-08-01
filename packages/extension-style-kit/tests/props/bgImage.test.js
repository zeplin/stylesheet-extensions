import BgImage from "@root/props/bgImage";

import Gradient from "@root/values/gradient";

test("property name", () => {
    const bgImage = new BgImage([Gradient.fromRGBA({ r: 255, g: 0, b: 0 })]);

    expect(bgImage.name).toBe("background-image");
});

test("background-image gradient value", () => {
    const bgImage = new BgImage([Gradient.fromRGBA({ r: 255, g: 0, b: 0 })]);

    expect(bgImage.getValue({ colorFormat: "hex" })).toBe("linear-gradient(to bottom, #ff0000, #ff0000)");
});

test("background-image multiple values", () => {
    const bgImage = new BgImage([
        Gradient.fromRGBA({ r: 255, g: 0, b: 0 }),
        Gradient.fromRGBA({ r: 255, g: 255, b: 0 })
    ]);

    expect(bgImage.getValue({ colorFormat: "hex" }))
        .toBe("linear-gradient(to bottom, #ff0000, #ff0000), linear-gradient(to bottom, #ffff00, #ffff00)");
});

test("equality check", () => {
    const bgImage = new BgImage([
        Gradient.fromRGBA({ r: 255, g: 0, b: 0 }),
        Gradient.fromRGBA({ r: 255, g: 255, b: 0 })
    ]);
    const other = new BgImage([
        Gradient.fromRGBA({ r: 255, g: 0, b: 0 }),
        Gradient.fromRGBA({ r: 255, g: 255, b: 0 })
    ]);

    expect(bgImage.equals(other)).toBe(true);
});

test("equality check (unequal)", () => {
    const bgImage = new BgImage([
        Gradient.fromRGBA({ r: 255, g: 0, b: 0 }),
        Gradient.fromRGBA({ r: 255, g: 255, b: 0 })
    ]);
    const other = new BgImage([
        Gradient.fromRGBA({ r: 255, g: 0, b: 0 })
    ]);

    expect(bgImage.equals(other)).toBe(false);
});
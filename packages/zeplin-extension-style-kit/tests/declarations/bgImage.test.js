import BackgroundImage from "@root/declarations/backgroundImage";

import Gradient from "@root/values/gradient";

test("property name", () => {
    const backgroundImage = new BackgroundImage([Gradient.fromRGBA({ r: 255, g: 0, b: 0 })]);

    expect(backgroundImage.name).toBe("background-image");
});

test("background-image gradient value", () => {
    const backgroundImage = new BackgroundImage([Gradient.fromRGBA({ r: 255, g: 0, b: 0 })]);

    expect(backgroundImage.getValue({ colorFormat: "hex" })).toBe("linear-gradient(to bottom, #ff0000, #ff0000)");
});

test("background-image multiple values", () => {
    const backgroundImage = new BackgroundImage([
        Gradient.fromRGBA({ r: 255, g: 0, b: 0 }),
        Gradient.fromRGBA({ r: 255, g: 255, b: 0 })
    ]);

    expect(backgroundImage.getValue({ colorFormat: "hex" }))
        .toBe("linear-gradient(to bottom, #ff0000, #ff0000), linear-gradient(to bottom, #ffff00, #ffff00)");
});

test("equality check", () => {
    const backgroundImage = new BackgroundImage([
        Gradient.fromRGBA({ r: 255, g: 0, b: 0 }),
        Gradient.fromRGBA({ r: 255, g: 255, b: 0 })
    ]);
    const other = new BackgroundImage([
        Gradient.fromRGBA({ r: 255, g: 0, b: 0 }),
        Gradient.fromRGBA({ r: 255, g: 255, b: 0 })
    ]);

    expect(backgroundImage.equals(other)).toBe(true);
});

test("equality check (unequal)", () => {
    const backgroundImage = new BackgroundImage([
        Gradient.fromRGBA({ r: 255, g: 0, b: 0 }),
        Gradient.fromRGBA({ r: 255, g: 255, b: 0 })
    ]);
    const other = new BackgroundImage([
        Gradient.fromRGBA({ r: 255, g: 0, b: 0 })
    ]);

    expect(backgroundImage.equals(other)).toBe(false);
});
import BorderImageSource from "@root/declarations/borderImageSource";

import Gradient from "@root/values/gradient";

test("property name", () => {
    const borderImageSource = new BorderImageSource(Gradient.fromRGBA({ r: 255, g: 0, b: 0 }));

    expect(borderImageSource.name).toBe("border-image-source");
});

test("background-image gradient value", () => {
    const borderImageSource = new BorderImageSource(Gradient.fromRGBA({ r: 255, g: 0, b: 0 }));

    expect(borderImageSource.getValue({ colorFormat: "hex" })).toBe("linear-gradient(to bottom, #ff0000, #ff0000)");
});

test("equality check", () => {
    const borderImageSource = new BorderImageSource(Gradient.fromRGBA({ r: 255, g: 0, b: 0 }));
    const other = new BorderImageSource(Gradient.fromRGBA({ r: 255, g: 0, b: 0 }));

    expect(borderImageSource.equals(other)).toBe(true);
});

test("equality check (unequal)", () => {
    const borderImageSource = new BorderImageSource(Gradient.fromRGBA({ r: 255, g: 0, b: 0 }));
    const other = new BorderImageSource(Gradient.fromRGBA({ r: 255, g: 255, b: 0 }));

    expect(borderImageSource.equals(other)).toBe(false);
});
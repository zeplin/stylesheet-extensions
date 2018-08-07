import Color from "@root/values/color";
import Gradient from "@root/values/gradient";

test("rgb representation (opacity: 1)", () => {
    const color = Color.fromRGBA({ r: 13, g: 13, b: 13 });

    expect(color.toStyleValue({ colorFormat: "rgb" })).toBe("rgb(13, 13, 13)");
});

test("rgb representation (opacity < 1)", () => {
    const color = Color.fromRGBA({ r: 13, g: 13, b: 13, a: 0.13 });

    expect(color.toStyleValue({ colorFormat: "rgb" })).toBe("rgba(13, 13, 13, 0.13)");
});

test("hsl representation", () => {
    const color = Color.fromRGBA({ r: 13, g: 13, b: 13, a: 0.13 });

    expect(color.toStyleValue({ colorFormat: "hsl" })).toBe("hsla(0, 0%, 5%, 0.13)");
});

test("hex representation (opacity: 1)", () => {
    const color = Color.fromRGBA({ r: 13, g: 13, b: 13 });

    expect(color.toStyleValue({ colorFormat: "hex" })).toBe("#0d0d0d");
});

test("hex representation (opacity < 1)", () => {
    const color = Color.fromRGBA({ r: 13, g: 13, b: 13, a: 0.47 });

    expect(color.toStyleValue({ colorFormat: "hex" })).toBe("#0d0d0d78");
});

test("equality check", () => {
    const color = Color.fromRGBA({ r: 13, g: 13, b: 13 });
    const other = Color.fromRGBA({ r: 13, g: 13, b: 13 });

    expect(color.equals(other)).toBe(true);
});

test("equality check (unequal)", () => {
    const color = Color.fromRGBA({ r: 13, g: 13, b: 12 });
    const other = Color.fromRGBA({ r: 13, g: 13, b: 13 });

    expect(color.equals(other)).toBe(false);
});

test("style value uses variable", () => {
    const color = Color.fromRGBA({ r: 13, g: 13, b: 13 });
    const variables = {
        [color.valueOf()]: "var(--cod_gray)"
    };

    expect(color.toStyleValue({ colorFormat: "hex" }, variables)).toBe("var(--cod_gray)");
});

test("gradient value", () => {
    const color = Color.fromRGBA({ r: 13, g: 13, b: 13, a: 0.47 });
    const gradient = Gradient.fromRGBA({ r: 13, g: 13, b: 13, a: 0.47 });

    expect(color.toGradient().equals(gradient)).toBe(true);
});

test("invalid color object", () => {
    const color = new Color({});

    expect(color.toStyleValue({ colorFormat: "hex" })).toBe("");
});
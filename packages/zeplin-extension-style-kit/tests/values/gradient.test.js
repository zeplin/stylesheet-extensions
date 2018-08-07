import Color from "@root/values/color";
import Gradient from "@root/values/gradient";

import generateGradientObject from "@testHelpers/generateGradientObject";

test("linear gradient (hex)", () => {
    const lg = new Gradient(generateGradientObject({ type: "linear" }));

    expect(lg.toStyleValue({ colorFormat: "hex" })).toBe("linear-gradient(to bottom, #ffffff80, #00000080)");
});

test("linear gradient with color stops at 0, 50%, 100%", () => {
    const g = new Gradient(generateGradientObject({
        type: "linear",
        colorStops: [{
            color: {
                r: 255,
                g: 255,
                b: 255,
                a: 0.5
            },
            position: 0
        }, {
            color: {
                r: 255,
                g: 255,
                b: 0,
                a: 1
            },
            position: 0.5
        }, {
            color: {
                r: 0,
                g: 0,
                b: 0,
                a: 0.5
            },
            position: 1
        }]
    }));

    expect(g.toStyleValue({ colorFormat: "hex" })).toBe("linear-gradient(to bottom, #ffffff80, #ffff00 50%, #00000080)");
});

test("linear gradient with 0°", () => {
    const g = new Gradient(generateGradientObject({
        type: "linear",
        from: {
            x: 0.5,
            y: 1
        },
        to: {
            x: 0.5,
            y: 0
        }
    }));

    expect(g.toStyleValue({ colorFormat: "hex" })).toBe("linear-gradient(to top, #ffffff80, #00000080)");
});

test("linear gradient with 90°", () => {
    const g = new Gradient(generateGradientObject({
        type: "linear",
        from: {
            x: 0,
            y: 1
        },
        to: {
            x: 0.5,
            y: 1
        }
    }));

    expect(g.toStyleValue({ colorFormat: "hex" })).toBe("linear-gradient(to right, #ffffff80, #00000080)");
});

test("linear gradient with 180°", () => {
    const g = new Gradient(generateGradientObject({
        type: "linear",
        from: {
            x: 0.5,
            y: 0
        },
        to: {
            x: 0.5,
            y: 1
        }
    }));

    expect(g.toStyleValue({ colorFormat: "hex" })).toBe("linear-gradient(to bottom, #ffffff80, #00000080)");
});

test("linear gradient with 270°", () => {
    const g = new Gradient(generateGradientObject({
        type: "linear",
        from: {
            x: 0.5,
            y: 1
        },
        to: {
            x: 0,
            y: 1
        }
    }));

    expect(g.toStyleValue({ colorFormat: "hex" })).toBe("linear-gradient(to left, #ffffff80, #00000080)");
});

test("linear gradient with 135°", () => {
    const g = new Gradient(generateGradientObject({
        type: "linear",
        from: {
            x: 0,
            y: 0
        },
        to: {
            x: 0.5,
            y: 0.5
        }
    }));

    expect(g.toStyleValue({ colorFormat: "hex" })).toBe("linear-gradient(135deg, #ffffff80, #00000080)");
});

test("radial gradient (hsl)", () => {
    const rg = new Gradient(generateGradientObject({ type: "radial" }));

    expect(rg.toStyleValue({ colorFormat: "hsl" })).toBe("radial-gradient(circle at 50% 0, hsla(0, 0%, 100%, 0.5), hsla(0, 0%, 0%, 0.5))");
});

test("angular gradient (rgb)", () => {
    const ag = new Gradient(generateGradientObject({ type: "angular" }));

    expect(ag.toStyleValue({ colorFormat: "rgb" })).toBe("conic-gradient(rgba(255, 255, 255, 0.5), rgba(0, 0, 0, 0.5), rgba(255, 255, 255, 0.5))");
});

test("invalid gradient type", () => {
    const ag = new Gradient(generateGradientObject({ type: "fractal" }));

    expect(ag.toStyleValue({ colorFormat: "rgb" })).toBe("");
});

test("equality check", () => {
    const gradient = new Gradient(generateGradientObject({ type: "linear" }));
    const other = new Gradient(generateGradientObject({ type: "linear" }));

    expect(gradient.equals(other)).toBe(true);
});

test("equality check (different types)", () => {
    const gradient = new Gradient(generateGradientObject({ type: "linear" }));
    const other = new Gradient(generateGradientObject({ type: "radial" }));

    expect(gradient.equals(other)).toBe(false);
});

test("equality check (different angles)", () => {
    const gradient = new Gradient(generateGradientObject({ type: "linear" }));
    const other = new Gradient(generateGradientObject({
        type: "radial",
        from: {
            x: 0.5,
            y: 1
        },
        to: {
            x: 0.5,
            y: 0
        }
    }));

    expect(gradient.equals(other)).toBe(false);
});

test("equality check (different color stops)", () => {
    const gradient = new Gradient(generateGradientObject({ type: "linear" }));
    const other = new Gradient(generateGradientObject({
        type: "linear",
        colorStops: [{
            color: {
                r: 255,
                g: 255,
                b: 255,
                a: 0.5
            },
            position: 0
        }, {
            color: {
                r: 255,
                g: 255,
                b: 0,
                a: 1
            },
            position: 0.5
        }, {
            color: {
                r: 0,
                g: 0,
                b: 0,
                a: 0.5
            },
            position: 1
        }]
    }));

    expect(gradient.equals(other)).toBe(false);
});

test("gradient from rgba", () => {
    const gradient = Gradient.fromRGBA({ r: 255, g: 255, b: 0 });

    expect(gradient.toStyleValue({ colorFormat: "hex" })).toBe("linear-gradient(to bottom, #ffff00, #ffff00)");
});

test("gradient from rgba (uses variables)", () => {
    const rgba = { r: 13, g: 13, b: 13 };
    const gradient = Gradient.fromRGBA(rgba);
    const variables = {
        [Color.fromRGBA(rgba).valueOf()]: "var(--cod_gray)"
    };

    expect(gradient.toStyleValue({ colorFormat: "hex" }, variables)).toBe("linear-gradient(to bottom, var(--cod_gray), var(--cod_gray))");
});
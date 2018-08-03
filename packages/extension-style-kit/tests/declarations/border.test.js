import Border from "@root/declarations/border";

import Color from "@root/values/color";
import Length from "@root/values/length";

test("property name", () => {
    const border = new Border({
        style: "solid",
        width: new Length(1),
        color: Color.fromRGBA({ r: 0, g: 0, b: 0 })
    });

    expect(border.name).toBe("border");
});

test("border value", () => {
    const params = { densityDivisor: 2, colorFormat: "hex" };
    const borderStyle = "solid";
    const borderWidth = 2;
    const borderColor = Color.fromRGBA({ r: 0, g: 0, b: 0 });
    const border = new Border({
        style: borderStyle,
        width: new Length(borderWidth),
        color: borderColor
    });

    expect(border.getValue(params)).toBe(`${borderStyle} ${borderWidth / params.densityDivisor}px ${borderColor.toStyleValue(params)}`);
});

test("equality check", () => {
    const border = new Border({
        style: "solid",
        width: new Length(1),
        color: Color.fromRGBA({ r: 0, g: 0, b: 0 })
    });

    const other = new Border({
        style: "solid",
        width: new Length(1),
        color: Color.fromRGBA({ r: 0, g: 0, b: 0 })
    });

    expect(border.equals(other)).toBe(true);
});

test("equality check (unequal, different styles)", () => {
    const border = new Border({
        style: "solid",
        width: new Length(1),
        color: Color.fromRGBA({ r: 0, g: 0, b: 0 })
    });

    const other = new Border({
        style: "dashed",
        width: new Length(1),
        color: Color.fromRGBA({ r: 0, g: 0, b: 0 })
    });

    expect(border.equals(other)).toBe(false);
});

test("equality check (unequal, different width)", () => {
    const border = new Border({
        style: "solid",
        width: new Length(1),
        color: Color.fromRGBA({ r: 0, g: 0, b: 0 })
    });

    const other = new Border({
        style: "solid",
        width: new Length(2),
        color: Color.fromRGBA({ r: 0, g: 0, b: 0 })
    });

    expect(border.equals(other)).toBe(false);
});

test("equality check (unequal, different color)", () => {
    const border = new Border({
        style: "solid",
        width: new Length(1),
        color: Color.fromRGBA({ r: 255, g: 0, b: 0 })
    });

    const other = new Border({
        style: "solid",
        width: new Length(1),
        color: Color.fromRGBA({ r: 0, g: 0, b: 0 })
    });

    expect(border.equals(other)).toBe(false);
});
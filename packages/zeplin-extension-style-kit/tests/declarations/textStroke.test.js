import TextStroke from "@root/declarations/textStroke";

import Color from "@root/values/color";
import Length from "@root/values/length";

test("property name", () => {
    const textStroke = new TextStroke({
        style: "solid",
        width: new Length(1),
        color: Color.fromRGBA({ r: 0, g: 0, b: 0 })
    });

    expect(textStroke.name).toBe("text-stroke");
});

test("text-stroke value", () => {
    const params = { densityDivisor: 2, colorFormat: "hex" };
    const length = 2;
    const strokeColor = Color.fromRGBA({ r: 0, g: 0, b: 0 });
    const textStroke = new TextStroke(new Length(length), strokeColor);

    expect(textStroke.getValue(params)).toBe(`${length / params.densityDivisor}px ${strokeColor.toStyleValue(params)}`);
});

test("equality check", () => {
    const textStroke = new TextStroke(new Length(1), Color.fromRGBA({ r: 0, g: 0, b: 0 }));
    const other = new TextStroke(new Length(1), Color.fromRGBA({ r: 0, g: 0, b: 0 }));

    expect(textStroke.equals(other)).toBe(true);
});

test("equality check (unequal, different length)", () => {
    const textStroke = new TextStroke(new Length(2), Color.fromRGBA({ r: 0, g: 0, b: 0 }));
    const other = new TextStroke(new Length(1), Color.fromRGBA({ r: 0, g: 0, b: 0 }));

    expect(textStroke.equals(other)).toBe(false);
});

test("equality check (unequal, different color)", () => {
    const textStroke = new TextStroke(new Length(1), Color.fromRGBA({ r: 255, g: 0, b: 0 }));
    const other = new TextStroke(new Length(1), Color.fromRGBA({ r: 0, g: 0, b: 0 }));

    expect(textStroke.equals(other)).toBe(false);
});
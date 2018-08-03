import Opacity from "@root/declarations/opacity";

import Scalar from "@root/values/scalar";

test("property name", () => {
    const opacity = new Opacity(new Scalar(0.33));

    expect(opacity.name).toBe("opacity");
});

test("opacity value", () => {
    const opacity = new Opacity(new Scalar(0.33));

    expect(opacity.getValue()).toBe("0.33");
});

test("equality check", () => {
    const opacity = new Opacity(new Scalar(0.33));
    const other = new Opacity(new Scalar(0.33));

    expect(opacity.equals(other)).toBe(true);
});

test("equality check (unequal)", () => {
    const opacity = new Opacity(new Scalar(0.33));
    const other = new Opacity(new Scalar("0.13"));

    expect(opacity.equals(other)).toBe(false);
});
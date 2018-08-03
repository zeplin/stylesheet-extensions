import Scalar from "@root/values/scalar";

test("integer value returns the exact value", () => {
    const scalar = new Scalar(13);

    expect(scalar.toStyleValue()).toBe("13");
});

test("equality check", () => {
    const scalar = new Scalar("13.1");
    const other = new Scalar("13.1");

    expect(scalar.equals(other)).toBe(true);
});

test("decimal digits are rounded so as to keep max two digits (default precision)", () => {
    const scalar = new Scalar("13.132");

    expect(scalar.toStyleValue()).toBe("13.13");
});

test("decimal digits are rounded wrt precision", () => {
    const scalar = new Scalar("13.13245", 3);

    expect(scalar.toStyleValue()).toBe("13.132");
});
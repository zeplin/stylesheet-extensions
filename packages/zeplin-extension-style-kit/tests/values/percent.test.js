import Percent from "@root/values/percent";

test("zero is 0 without percent symbol", () => {
    const pc = new Percent(0);

    expect(pc.toStyleValue()).toBe("0");
});

test("equality check (zero)", () => {
    const pc = new Percent(0);
    const other = new Percent(0);

    expect(pc.equals(other)).toBe(true);
});

test("equality check (non-zero)", () => {
    const pc = new Percent(0.13);
    const other = new Percent(0.13);

    expect(pc.equals(other)).toBe(true);
});

test("a value in (0, 1] interval is converted to percentage", () => {
    const pc = new Percent(0.13);

    expect(pc.toStyleValue()).toBe("13%");
});
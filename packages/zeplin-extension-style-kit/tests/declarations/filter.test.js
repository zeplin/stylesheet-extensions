import Filter from "@root/declarations/filter";

import Length from "@root/values/length";
import Percent from "@root/values/percent";

test("property name", () => {
    const filter = new Filter([
        { fn: "blur", args: [new Length(13, "px")] }
    ]);

    expect(filter.name).toBe("filter");
});

test("single filter", () => {
    const filter = new Filter([
        { fn: "blur", args: [new Length(13, "px")] }
    ]);

    expect(filter.getValue({ densityDivisor: 1 })).toBe("blur(13px)");
});

test("multiple filters", () => {
    const filter = new Filter([
        { fn: "blur", args: [new Length(13, "px")] },
        { fn: "saturate", args: [new Percent(1.3)] }
    ]);

    expect(filter.getValue({ densityDivisor: 1 })).toBe("blur(13px) saturate(130%)");
});

test("equality check", () => {
    const filter = new Filter([
        { fn: "blur", args: [new Length(13, "px")] }
    ]);
    const other = new Filter([
        { fn: "blur", args: [new Length(13, "px")] }
    ]);

    expect(filter.equals(other)).toBe(true);
});

test("equality check (multiple filters in same order)", () => {
    const filter = new Filter([
        { fn: "blur", args: [new Length(13, "px")] },
        { fn: "saturate", args: [new Percent(1.3)] }
    ]);
    const other = new Filter([
        { fn: "blur", args: [new Length(13, "px")] },
        { fn: "saturate", args: [new Percent(1.3)] }
    ]);

    expect(filter.equals(other)).toBe(true);
});

test("equality check (different filters)", () => {
    const filter = new Filter([
        { fn: "blur", args: [new Length(13, "px")] },
        { fn: "saturate", args: [new Percent(1.3)] }
    ]);
    const other = new Filter([
        { fn: "blur", args: [new Length(13, "px")] }
    ]);

    expect(filter.equals(other)).toBe(false);
});

test("equality check (same filters in differing order)", () => {
    const filter = new Filter([
        { fn: "blur", args: [new Length(13, "px")] },
        { fn: "saturate", args: [new Percent(1.3)] }
    ]);
    const other = new Filter([
        { fn: "saturate", args: [new Percent(1.3)] },
        { fn: "blur", args: [new Length(13, "px")] }
    ]);

    expect(filter.equals(other)).toBe(false);
});
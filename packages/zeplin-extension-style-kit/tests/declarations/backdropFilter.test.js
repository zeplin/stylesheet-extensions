import BackdropFilter from "@root/declarations/backdropFilter";

import Length from "@root/values/length";
import Percent from "@root/values/percent";

test("property name", () => {
    const backdropFilter = new BackdropFilter([
        { fn: "blur", args: [new Length(13, "px")] }
    ]);

    expect(backdropFilter.name).toBe("backdrop-filter");
});

test("single filter", () => {
    const backdropFilter = new BackdropFilter([
        { fn: "blur", args: [new Length(13, "px")] }
    ]);

    expect(backdropFilter.getValue({ densityDivisor: 1 })).toBe("blur(13px)");
});

test("multiple filters", () => {
    const backdropFilter = new BackdropFilter([
        { fn: "blur", args: [new Length(13, "px")] },
        { fn: "saturate", args: [new Percent(1.3)] }
    ]);

    expect(backdropFilter.getValue({ densityDivisor: 1 })).toBe("blur(13px) saturate(130%)");
});

test("equality check", () => {
    const backdropFilter = new BackdropFilter([
        { fn: "blur", args: [new Length(13, "px")] }
    ]);
    const other = new BackdropFilter([
        { fn: "blur", args: [new Length(13, "px")] }
    ]);

    expect(backdropFilter.equals(other)).toBe(true);
});

test("equality check (multiple filters in same order)", () => {
    const backdropFilter = new BackdropFilter([
        { fn: "blur", args: [new Length(13, "px")] },
        { fn: "saturate", args: [new Percent(1.3)] }
    ]);
    const other = new BackdropFilter([
        { fn: "blur", args: [new Length(13, "px")] },
        { fn: "saturate", args: [new Percent(1.3)] }
    ]);

    expect(backdropFilter.equals(other)).toBe(true);
});

test("equality check (different filters)", () => {
    const backdropFilter = new BackdropFilter([
        { fn: "blur", args: [new Length(13, "px")] },
        { fn: "saturate", args: [new Percent(1.3)] }
    ]);
    const other = new BackdropFilter([
        { fn: "blur", args: [new Length(13, "px")] }
    ]);

    expect(backdropFilter.equals(other)).toBe(false);
});

test("equality check (same filters in differing order)", () => {
    const backdropFilter = new BackdropFilter([
        { fn: "blur", args: [new Length(13, "px")] },
        { fn: "saturate", args: [new Percent(1.3)] }
    ]);
    const other = new BackdropFilter([
        { fn: "saturate", args: [new Percent(1.3)] },
        { fn: "blur", args: [new Length(13, "px")] }
    ]);

    expect(backdropFilter.equals(other)).toBe(false);
});
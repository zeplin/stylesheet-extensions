import BorderImageSlice from "@root/declarations/borderImageSlice";

import Percent from "@root/values/percent";

test("property name", () => {
    const bis = new BorderImageSlice(new Percent(0.33));

    expect(bis.name).toBe("border-image-slice");
});

test("border-image-slice value", () => {
    const bis = new BorderImageSlice(new Percent(0.33));

    expect(bis.getValue()).toBe("33%");
});

test("equality check", () => {
    const bis = new BorderImageSlice(new Percent(0.33));
    const other = new BorderImageSlice(new Percent(0.33));

    expect(bis.equals(other)).toBe(true);
});

test("equality check (unequal)", () => {
    const bis = new BorderImageSlice(new Percent(0.33));
    const other = new BorderImageSlice(new Percent(0.13));

    expect(bis.equals(other)).toBe(false);
});
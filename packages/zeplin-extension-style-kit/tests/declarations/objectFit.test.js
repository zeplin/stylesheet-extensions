import ObjectFit from "@root/declarations/objectFit";

test("property name", () => {
    const clip = new ObjectFit("cover");

    expect(clip.name).toBe("object-fit");
});

test("object-fit value", () => {
    const clip = new ObjectFit("cover");

    expect(clip.getValue()).toBe("cover");
});

test("equality check", () => {
    const clip = new ObjectFit("cover");
    const other = new ObjectFit("cover");

    expect(clip.equals(other)).toBe(true);
});

test("equality check (unequal)", () => {
    const clip = new ObjectFit("cover");
    const other = new ObjectFit("contain");

    expect(clip.equals(other)).toBe(false);
});
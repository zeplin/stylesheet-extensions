export const CLASS_VALUE_MAP: Record<string, Record<number, string>> = {
    // Spacing (margin, padding, gap, etc.)
    "spacing-class": {
        256: "3xs", // 16rem
        288: "2xs", // 18rem
        320: "xs",  // 20rem
        384: "sm",  // 24rem
        448: "md",  // 28rem
        512: "lg",  // 32rem
        576: "xl",  // 36rem
        672: "2xl", // 42rem
        768: "3xl", // 48rem
        896: "4xl", // 56rem
        1024: "5xl",// 64rem
        1152: "6xl",// 72rem
        1280: "7xl",// 80rem
    } as const,

    // Border radius https://tailwindcss.com/docs/border-radius
    "rounded": {
        0: "none",
        2: "xs",
        4: "sm",
        6: "md",
        8: "lg",
        12: "xl",
        16: "2xl",
        24: "3xl"
    } as const,

    "text": {
        12: "xs",
        14: "sm",
        16: "base",
        18: "lg",
        20: "xl",
        24: "2xl",
        30: "3xl",
        36: "4xl",
        48: "5xl",
        60: "6xl",
        72: "7xl",
        96: "8xl",
        128: "9xl"
    } as const,

    "blur": {
        4: "xs",
        8: "sm",
        12: "md",
        16: "lg",
        24: "xl",
        40: "2xl",
        64: "3xl"
    } as const
} as const;

export const findMatchingClassValue = (
    value: number,
    type: keyof typeof CLASS_VALUE_MAP
): string | null => {
    const typeMap = CLASS_VALUE_MAP[type];

    if (typeMap === undefined) {
        return null;
    }

    return typeMap[value] ? typeMap[value] : null;
};

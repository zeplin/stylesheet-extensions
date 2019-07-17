import AtRule from "../atRule";

declare class FontFace {
    constructor(fontObject: object);

    static comparator(prev: FontFace, cur: FontFace): number;

    style: AtRule;
}

export = FontFace;

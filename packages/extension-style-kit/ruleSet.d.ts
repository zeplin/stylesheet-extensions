import { StyleProp } from "../common";

declare class RuleSet {
    constructor(selector: string, props: Array<StyleProp>);

    selector: string;

    props: Array<StyleProp>;

    addProp(prop: StyleProp): void;

    removeProp(prop: StyleProp): void;
}

export = RuleSet;
import { StyleProp } from "../common";
import RuleSet from "../ruleSet";

interface TextStyleParams {
    showDefaultValues?: boolean;
}

declare class TextStyle {
    constructor(textStyleObject: object, params: TextStyleParams);

    style: RuleSet;
}

export = TextStyle;
import { BackgroundImage, StyleProp } from "../common";
import Color from "../values/color";
import RuleSet from "../ruleSet";

declare class Layer {
    constructor(layerObject: object);

    style: RuleSet;
    childrenStyles: Array<RuleSet>;

    hasBlendMode: boolean;
    hasGradient: boolean;
    hasFill: boolean;

    bgImages: Array<BackgroundImage>;
    fillColor: Color;

    getLayerTextStyleProps(textStyle: object): Array<StyleProp>;
}

export = Layer;
import { BackgroundImage, StyleDeclaration } from "../common";
import Color from "../values/color";
import RuleSet from "../ruleSet";

declare class Layer {
    constructor(layerObject: object);

    style: RuleSet;
    childrenStyles: Array<RuleSet>;

    hasBlendMode: boolean;
    hasGradient: boolean;
    hasFill: boolean;

    backgroundImages: Array<BackgroundImage>;
    fillColor: Color;

    getLayerTextStyleDeclarations(textStyle: object): Array<StyleDeclaration>;
}

export = Layer;

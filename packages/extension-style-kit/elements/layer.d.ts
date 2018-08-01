import { BackgroundImage, StyleProp } from "../common";
import Color from "../values/color";
import RuleSet from "../ruleSet";

interface LayerParams {
    showDefaultValues?: boolean;
    showDimensions?: boolean;
    useMixin?: boolean;
}

declare class Layer {
    constructor(layerObject: object, params: LayerParams);

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
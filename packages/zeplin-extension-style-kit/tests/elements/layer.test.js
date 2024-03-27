import { Version } from "@zeplin/extension-model";
import TestExtension from "../helpers/testExtension";

import simpleTextLayer from "./__data__/layer/simple_text";
import colorFillTextLayer from "./__data__/layer/text_color_fill";
import gradientFillTextLayer from "./__data__/layer/text_gradient_fill";
import multipleColorFillTextLayer from "./__data__/layer/text_multiple_color_fill";
import colorAndFillTextLayer from "./__data__/layer/text_color_layer_fill";
import textWithShadow from "./__data__/layer/text_with_shadow";
import textWithBlur from "./__data__/layer/text_with_blur";
import textWithBorder from "./__data__/layer/text_with_border";
import textRightAligned from "./__data__/layer/text_right_aligned";
import multipleTextStyle from "./__data__/layer/multiple_text_style";
import rectSimple from "./__data__/layer/rect_simple";
import rectRotated from "./__data__/layer/rect_rotated";
import rectBlentColorFill from "./__data__/layer/rect_blent_color_fill";
import rectMultipleShadow from "./__data__/layer/rect_multiple_shadow";
import rectMultipleBorder from "./__data__/layer/rect_multiple_border";
import rectIndividualBorder from "./__data__/layer/rect_individual_border";
import rectBorderRadius from "./__data__/layer/rect_border_radius";
import rectGradientBorder from "./__data__/layer/rect_gradient_border";
import rectGradientFillGradientBorder from "./__data__/layer/rect_gradient_fill_gradient_border";

const extension = new TestExtension({
    densityDivisor: 2,
    colorFormat: "rgb",
    showDimensions: true,
    showDefaultValues: true,
    unitlessLineHeight: true
});

const getLayer = layer => new Version(
    {
        snapshot: {
            layers: [layer],
            width: 1024,
            height: 768
        }
    }
).layers[0];

describe("layer", () => {
    test("plain text layer", () => {
        expect(extension.layer(getLayer(simpleTextLayer))).toMatchSnapshot();
    });

    test("text layer with color fill", () => {
        expect(extension.layer(getLayer(colorFillTextLayer))).toMatchSnapshot();
    });

    test("text layer with multiple color fill", () => {
        expect(extension.layer(getLayer(multipleColorFillTextLayer))).toMatchSnapshot();
    });

    test("text layer with gradient fill", () => {
        expect(extension.layer(getLayer(gradientFillTextLayer))).toMatchSnapshot();
    });

    test("colored text layer with color fill", () => {
        expect(extension.layer(getLayer(colorAndFillTextLayer))).toMatchSnapshot();
    });

    test("text layer with shadow", () => {
        expect(extension.layer(getLayer(textWithShadow))).toMatchSnapshot();
    });

    test("text layer with blur", () => {
        expect(extension.layer(getLayer(textWithBlur))).toMatchSnapshot();
    });

    test("text layer with border", () => {
        expect(extension.layer(getLayer(textWithBorder))).toMatchSnapshot();
    });

    test("right aligned text layer", () => {
        expect(extension.layer(getLayer(textRightAligned))).toMatchSnapshot();
    });

    test("layer with multiple text style", () => {
        expect(extension.layer(getLayer(multipleTextStyle))).toMatchSnapshot();
    });

    test("simple shape layer", () => {
        expect(extension.layer(getLayer(rectSimple))).toMatchSnapshot();
    });

    test("rotated shape layer", () => {
        expect(extension.layer(getLayer(rectRotated))).toMatchSnapshot();
    });

    test("shape layer with multiple fill color", () => {
        expect(extension.layer(getLayer(rectBlentColorFill))).toMatchSnapshot();
    });

    test("shape layer with multiple shadow", () => {
        expect(extension.layer(getLayer(rectMultipleShadow))).toMatchSnapshot();
    });

    test("shape layer with multiple border", () => {
        expect(extension.layer(getLayer(rectMultipleBorder))).toMatchSnapshot();
    });

    test("shape layer with individual border", () => {
        expect(extension.layer(getLayer(rectIndividualBorder))).toMatchSnapshot();
    });

    test("shape layer with border radius", () => {
        expect(extension.layer(getLayer(rectBorderRadius))).toMatchSnapshot();
    });

    test("shape layer with gradient border", () => {
        expect(extension.layer(getLayer(rectGradientBorder))).toMatchSnapshot();
    });

    test("shape layer with gradient fill and gradient border", () => {
        expect(extension.layer(getLayer(rectGradientFillGradientBorder))).toMatchSnapshot();
    });
});

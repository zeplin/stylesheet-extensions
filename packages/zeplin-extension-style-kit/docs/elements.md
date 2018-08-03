# Elements
 Elements map design elements that Zeplin provides to the extension context such as layers and colors to the style properties. The logic needed to extract style properties are encapsulated by the elements and each element does now what properties it can extract and how it should be done.

 There are two types of elements:
 - [Layer](./elements.md#layer)
 - [TextStyle](./elements.md#textstyle)

## Layer
### `constructor(layerObject)`: `Layer`
Layer element is created from extension layer data.

#### Parameters:
 - `layerObject`: An instance of [`ExtensionModels.Layer`](https://github.com/zeplin/zeplin-extension-documentation/blob/master/model/layer.md)


### `style`: [`RuleSet`](./ruleSet.md)
 Style properties that apply to the layer and a selector are represented by a [`RuleSet`](./ruleSet.md) object.

### `childrenStyle`: [`RuleSet`](./ruleSet.md)
 If a layer contains one or more elements, style properties of each child are also represented with a [`RuleSet`](./ruleSet.md) object.

### `hasBlendMode`: `boolean`
 Return `true` if the layer has a fill whose blend mode is other than normal.

### `hasGradient`: `boolean`
 Return `true` if the layer has a gradient fill.

### `hasFill`: `boolean`
 Return `true` if the layer has a fill.

### `bgImages`: [`Array<Gradient>`]()
 This property returns the fills of a layer as [`Gradient`](./values.md#gradient) values.

### `fillColor`: [`Color`]()
 If a layer has multiple color fill and the blend mode is set to normal for each of them, this property returns the blent of them.

### `getLayerTextStyleDeclarations(textStyle)`: [`Array<StyleDeclaration>`](./declarations.md#styledeclaration)
Any layer with color/gradient has effect on the style of the tex styles it contains. This method takes a [ExtensionModels.TextStyle](https://github.com/zeplin/zeplin-extension-documentation/blob/master/model/textStyle.md) instance and returns the list of its style properties taking into account the parent layer's fills.

#### Parameters:
 - `textStyle`: An instance of [`ExtensionModels.TextStyle`](https://github.com/zeplin/zeplin-extension-documentation/blob/master/model/textStyle.md)

Returns:
An array of [StyleDeclaration](./declarations.md#styleDeclaration).


## TextStyle
### `constructor(textStyleObject)`: `TextStyle`
TextStyle element is created from extension text style data.

#### Parameters:
 - `textStyleObject`: An instance of [`ExtensionModels.TextStyle`](https://github.com/zeplin/zeplin-extension-documentation/blob/master/model/textStyle.md)

 Returns:
 A text style style element.

### `style`: [`RuleSet`](./ruleSet.md)
 Style properties that apply to the text style and a selector are represented by [`RuleSet`](./ruleSet.md) object.

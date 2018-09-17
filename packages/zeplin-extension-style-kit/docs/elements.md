# Elements

Elements map extension models (e.g. layers and colors) to their style properties. Currently, there are two elements:

- [Layer](./elements.md#layer)
- [TextStyle](./elements.md#textstyle)

## Layer

### `constructor(layerObject)`: `Layer`
Creates an instance from an extension layer instance.

#### Parameters:
- `layerObject`: An instance of [`ExtensionModels.Layer`](https://github.com/zeplin/zeplin-extension-documentation/blob/master/model/layer.md).

### `style`: [`RuleSet`](./ruleSet.md)
Returns style properties of the layer and a selector, represented by a [`RuleSet`](./ruleSet.md) instance.

### `childrenStyle`: [`RuleSet`](./ruleSet.md)
If the layer contains one or more elements, returns style properties of each child, represented by a [`RuleSet`](./ruleSet.md) instance.

### `hasBlendMode`: `boolean`
Returns `true` if the layer has a fill with a blend mode other than normal.

### `hasGradient`: `boolean`
Returns `true` if the layer has a gradient fill.

### `hasFill`: `boolean`
Returns `true` if the layer has a fill.

### `backgroundImages`: [`Array<Gradient>`]()
Returns fills of the layer as [`Gradient`](./values.md#gradient) values.

### `fillColor`: [`Color`]()
If the layer has multiple color fills and the blend mode is set to normal for each, returns the blended color.

### `getLayerTextStyleDeclarations(textStyle)`: [`Array<StyleDeclaration>`](./declarations.md#styledeclaration)
Layers with color or gradient fills affect its text styles. Returns an array of style properties from a [ExtensionModels.TextStyle](https://github.com/zeplin/zeplin-extension-documentation/blob/master/model/textStyle.md) instance, taking fills of the layer into account.

#### Parameters:
- `textStyle`: An instance of [`ExtensionModels.TextStyle`](https://github.com/zeplin/zeplin-extension-documentation/blob/master/model/textStyle.md).

#### Returns:
An array of [StyleDeclaration](./declarations.md#styleDeclaration).

## TextStyle

### `constructor(textStyleObject)`: `TextStyle`
Creates an instance from an extension text style instance.

#### Parameters:
- `textStyleObject`: An instance of [`ExtensionModels.TextStyle`](https://github.com/zeplin/zeplin-extension-documentation/blob/master/model/textStyle.md).

### `style`: [`RuleSet`](./ruleSet.md)
Returns style properties of the text style and a selector, represented by a [`RuleSet`](./ruleSet.md) instance.

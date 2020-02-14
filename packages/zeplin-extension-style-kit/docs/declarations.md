# Declarations

Declarations represent CSS properties. Every property has a name and a value, formed using one or more [`StyleValue`](./values.md#stylevalue) instances. All declarations conform to an interface called `StyleDeclaration`.

- [StyleDeclaration](#styledeclaration)
- [BackdropFilter](#backdropfilter)
- [BackgroundBlendMode](#backgroundblendmode)
- [BackgroundClip](#backgroundclip)
- [BackgroundColor](#backgroundcolor)
- [BackgroundImage](#backgroundimage)
- [BackgroundOrigin](#backgroundorigin)
- [Border](#border)
- [BorderImageSlice](#borderimageslice)
- [BorderImageSource](#borderimagesource)
- [BorderRadius](#borderradius)
- [BorderStyle](#borderstyle)
- [BorderWidth](#borderwidth)
- [Color](#color)
- [Filter](#filter)
- [FontSize](#fontsize)
- [FontStretch](#fontstretch)
- [FontStyle](#fontstyle)
- [FontWeight](#fontweight)
- [Height](#height)
- [LetterSpacing](#letterspacing)
- [LineHeight](#lineheight)
- [MixBlendMode](#mixblendmode)
- [Mixin](#mixin)
- [ObjectFit](#objectfit)
- [Opacity](#opacity)
- [Shadow](#shadow)
- [TextAlign](#textalign)
- [TextFillColor](#textfillcolor)
- [TextStroke](#textstroke)
- [Transform](#transform)
- [Width](#width)

## StyleDeclaration

Style declaration is the base interface for all style properties.

### `name`: `string`
Returns the name of the property, e.g. `background-color`.

### `equals(other: StyleDeclaration)`: `boolean`
Checks if `other` instance is equal to self.

#### Parameters:
- `other`: An instance conforming to `StyleDeclaration`.

### `getValue(params, variables)`: `string`
Returns the string that forms the value of the property.

#### Parameters:
- `params`: An instance conforming to [`StyleParams`](./types.md#styleparams). These parameters determine how internal values are being interpreted when string output is generated. See [`StyleParams`](./types.md#styleparams) to learn more.
- `variables`: An instance of [`VariableMap`](./types.md#variablemap), used to replace literal values if there is a variable declared with the same value.

## BackdropFilter

### `constructor(filters)`: `BackdropFilter`
Creates `backdrop-filter` property instance with `filters` functions. See [related docs](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter).

#### Parameters:
- `filters`: Array of [`StyleFunction`](./types.md#stylefunction) instances.

### name: string
Returns `backdrop-filter`.

### `equals(other)`: `boolean`
Checks if `other` instance is equal to self.

#### Parameters:
- `other`: `StyleDeclaration`

### `getValue(params)`: `string`
Returns the string representation.

#### Parameters:
- `params`: An instance conforming to [`StyleParams`](./types.md#styleparams).

```js
new BackdropFilter([
    { fn: "blur", args: [new Length(12)] },
    { fn: "saturate", args: [new Percent(35)] }
]).getValue({ densityDivisor: 2 }) // "blur("6px") saturate(35%)"
```

## BackgroundBlendMode

### `constructor(values)`: `BackgroundBlendMode`
Creates `background-blend-mode` property instance with `values`. See [related docs](https://developer.mozilla.org/en-US/docs/Web/CSS/background-blend-mode).

#### Parameters:
- `values`: Array of `string` values.

### name: string
Returns `background-blend-mode`.

### `equals(other)`: `boolean`
Checks if `other` instance is equal to self.

#### Parameters:
- `other`: `StyleDeclaration`

### `getValue()`: `string`
Returns the string representation.

```js
new BackgroundBlendMode(["darken", "luminosity"]).getValue() // "darken, luminosity"
```

## BackgroundClip

### `constructor(values)`: `BackgroundClip`
Creates `background-clip` property instance with `values`. See [related docs](https://developer.mozilla.org/en-US/docs/Web/CSS/background-clip).

#### Parameters:
- `values`: Array of `string` values.

### name: string
Returns `background-clip`.

### `equals(other)`: `boolean`
Checks if `other` instance is equal to self.

#### Parameters:
- `other`: `StyleDeclaration`

### `getValue()`: `string`
Returns the string representation.

```js
new BackgroundClip(["content-box"]).getValue() // "content-box"
```

## BackgroundColor

### `constructor(color)`: `BackgroundColor`
Creates `background-color` property instance with `color`. See [related docs](https://developer.mozilla.org/en-US/docs/Web/CSS/background-color).

#### Parameters:
- `color`: [`Color`](./values.md#color).

### name: string
Returns `background-color`.

### `equals(other)`: `boolean`
Checks if `other` instance is equal to self.

#### Parameters:
- `other`: `StyleDeclaration`

### `getValue(params, varibles)`: `string`
Returns the string representation.

#### Parameters:
- `params`: An instance conforming to [`ColorParams`](./types.md#colorparams).
- `variables`: A [`VariableMap`](./types.md#variablemap) instance.

```js
const white = new Color(...);
new BackgroundColor(white).getValue({ colorFormat: "hex" }) // "#ffffff"

const black = new Color(...);
new BackgroundColor(black).getValue({ colorFormat: "rgb" }) // "rgb(0, 0, 0)"

new BackgroundColor(black).getValue({ colorFormat: "rgb" }, variables) // "var(--black)"
```

## BackgroundImage

### `constructor(images)`: `BackgroundImage`
Creates `background-image` property instance with `images`. See [related docs](https://developer.mozilla.org/en-US/docs/Web/CSS/background-image).

#### Parameters:
- `images`: Array of [`Gradient`](./values.md#gradient) instances.

### name: string
Returns `background-image`.

### `equals(other)`: `boolean`
Checks if `other` instance is equal to self.

#### Parameters:
- `other`: `StyleDeclaration`

### `getValue(params, varibles)`: `string`
Returns the string representation.

#### Parameters:
- `params`: An object conforming to [`ColorParams`](./types.md#colorparams).
- `variables`: [`VariableMap`](./types.md#variablemap) object.

```js
const gradient = new Gradient(...);
new BackgroundImage([gradient]).getValue({ colorFormat: "rgb" }); // "linear-gradient(to right, rgb(48, 35, 174), rgb(83, 160, 253) 48%, rgb(180, 236, 81))"
```

## BackgroundOrigin

### `constructor(values)`: `BackgroundOrigin`
Creates `background-origin` property instance with `values`. See [related docs](https://developer.mozilla.org/en-US/docs/Web/CSS/background-origin).

#### Parameters:
- `values`: Array of `string` values.

### name: string
Returns `background-origin`.

### `equals(other)`: `boolean`
Checks if `other` instance is equal to self.

#### Parameters:
- `other`: `StyleDeclaration`

### `getValue()`: `string`
Returns the string representation.

```js
new BackgroundClip(["content-box"]).getValue(); // "content-box"
```

## Border

### `constructor({ style, width, color })`: `Border`
Creates `border` property instance with `color`. See [related docs](https://developer.mozilla.org/en-US/docs/Web/CSS/border).

#### Parameters:
- `style`: `string`, denotes the border style ("solid", "dashed", etc.).
- `width`: [`Length`](./values.md#length).
- `color`: [`Color`](./values.md#color).

### name: string
Returns `border`.

### `equals(other)`: `boolean`
Checks if `other` instance is equal to self.

#### Parameters:
- `other`: `StyleDeclaration`

### `getValue(params, varibles)`: `string`
Returns the string representation.

#### Parameters:
- `params`: An instance conforming to [`ColorParams`](./types.md#colorparams) and [`LengthParams`](./types.md#lengthparams).
- `variables`: A [`VariableMap`](./types.md#variablemap) instance.

```js
new Border({
    style: "solid",
    width: new Length(2),
    color: black
}).getValue({ densityDivisor: 2, colorFormat: "hex" }); // "solid 1px #000000"
```

## BorderImageSlice

### `constructor(value)`: `BorderImageSlice`
Creates `border-image-slice` property instance with `value`. See [related docs](https://developer.mozilla.org/en-US/docs/Web/CSS/border-image-slice).

#### Parameters:
- `value`: [`Scalar`](./values.md#scalar).

### name: string
Returns `border-image-slice`.

### `equals(other)`: `boolean`
Checks if `other` instance is equal to self.

#### Parameters:
- `other`: `StyleDeclaration`

### `getValue()`: `string`
Returns the string representation.

```js
new BorderImageSlice(new Scalar(1)).getValue() // "1"
```

## BorderImageSource

### `constructor(images)`: `BorderImageSource`
Creates `BorderImageSource` property instance with `images`. See [related docs](https://developer.mozilla.org/en-US/docs/Web/CSS/border-image-source).

#### Parameters:
- `images`: Array of [`Gradient`](./values.md#gradient) instances.

### name: string
Returns `border-image-source`.

### `equals(other)`: `boolean`
Checks if `other` instance is equal to self.

#### Parameters:
- `other`: `StyleDeclaration`

### `getValue(params, varibles)`: `string`
Returns the string representation.

#### Parameters:
- `params`: An object conforming to [`ColorParams`](./types.md#colorparams).
- `variables`: [`VariableMap`](./types.md#variablemap) object.

```js
const gradient = new Gradient(...);
new BorderImageSource([gradient])).getValue({ colorFormat: "rgb" }) // "linear-gradient(to right, rgb(48, 35, 174), rgb(83, 160, 253) 48%, rgb(180, 236, 81))"
```

## BorderRadius

### `constructor(length)`: `BorderRadius`
Creates `border-radius` property instance with `length`. See [related docs](https://developer.mozilla.org/en-US/docs/Web/CSS/border-radius).

#### Parameters:
- `length`: [`Length`](./values.md#length).

### name: string
Returns `border-radius`.

### `equals(other)`: `boolean`
Checks if `other` instance is equal to self.

#### Parameters:
- `other`: `StyleDeclaration`

### `getValue(params, varibles)`: `string`
Returns the string representation.

#### Parameters:
- `params`: An instance conforming to [`LengthParams`](./types.md#lengthparams).
- `variables`: A [`VariableMap`](./types.md#variablemap) instance.

```js
new BorderRadius(new Length(22)).getValue({ densityDivisor: 2 }); // "11px"
```

## BorderStyle

### `constructor(value)`: `BorderStyle`
Creates `border-style` property instance with `value`. See [related docs](https://developer.mozilla.org/en-US/docs/Web/CSS/border-style).

#### Parameters:
- `value`: `string`

### name: string
Returns `border-style`.

### `equals(other)`: `boolean`
Checks if `other` instance is equal to self.

#### Parameters:
- `other`: `StyleDeclaration`

### `getValue()`: `string`
Returns the string representation.

```js
new BorderStyle("dashed").getValue() // "dashed"
```

## BorderWidth

### `constructor(length)`: `BorderWidth`
Creates `border-width` property instance with `length`. See [related docs](https://developer.mozilla.org/en-US/docs/Web/CSS/border-width).

#### Parameters:
- `length`: [`Length`](./values.md#length).

### name: string
Returns `border-width`.

### `equals(other)`: `boolean`
Checks if `other` instance is equal to self.

#### Parameters:
- `other`: `StyleDeclaration`

### `getValue(params, varibles)`: `string`
Returns the string representation.

#### Parameters:
- `params`: An instance conforming to [`LengthParams`](./types.md#lengthparams).
- `variables`: A [`VariableMap`](./types.md#variablemap) instance.

```js
new BorderWidth(new Length(2)).getValue({ densityDivisor: 1 }); // "2px"
```

## FontColor

### `constructor(color)`: `FontColor`
Creates `color` property from `color` argument. See [related docs](https://developer.mozilla.org/en-US/docs/Web/CSS/color).

#### Parameters:
- `color`: [`Color`](./values.md#color) instance.

### name: string
Returns `color`.

### `equals(other)`: `boolean`
Checks if `other` instance is equal to self.

#### Parameters:
- `other`: `StyleDeclaration`

### `getValue(params, varibles)`: `string`
Returns the string representation.

#### Parameters:
- `params`: An object conforming to [`ColorParams`](./types.md#colorparams).
- `variables`: [`VariableMap`](./types.md#variablemap) object.

```js
const black = new Color(...);
new FontColor(gradient)).getValue({ colorFormat: "rgb" }) // "rgb(0, 0, 0)"
```

## Filter

### `constructor(filters)`: `Filter`
Creates `filter` property instance with `filters` functions. See [related docs](https://developer.mozilla.org/en-US/docs/Web/CSS/filter).

#### Parameters:
- `filters`: Array of [`StyleFunction`](./types.md#stylefunction) instances.

### name: string
Returns `filter`.

### `equals(other)`: `boolean`
Checks if `other` instance is equal to self.

#### Parameters:
- `other`: `StyleDeclaration`

### `getValue(params)`: `string`
Returns the string representation.

#### Parameters:
- `params`: An instance conforming to [`StyleParams`](./types.md#styleparams).

```js
new Filter([
    { fn: "blur", args: [new Length(12)] },
    { fn: "saturate", args: [new Percent(35)] }
]).getValue({ densityDivisor: 2 }) // "blur("6px") saturate(35%)"
```

## FontSize

### `constructor(length)`: `FontSize`
Creates `font-size` property instance with `length`. See [related docs](https://developer.mozilla.org/en-US/docs/Web/CSS/font-size).

#### Parameters:
- `length`: [`Length`](./values.md#length).

### name: string
Returns `font-size`.

### `equals(other)`: `boolean`
Checks if `other` instance is equal to self.

#### Parameters:
- `other`: `StyleDeclaration`

### `getValue(params, varibles)`: `string`
Returns the string representation.

#### Parameters:
- `params`: An instance conforming to [`LengthParams`](./types.md#lengthparams).
- `variables`: A [`VariableMap`](./types.md#variablemap) instance.

```js
new FontSize(new Length(12)).getValue({ densityDivisor: 1 }) // "12px"
```

## FontStretch

### `constructor(value)`: `FontStretch`
Creates `font-stretch` property instance with `value`. See [related docs](https://developer.mozilla.org/en-US/docs/Web/CSS/font-stretch).

#### Parameters:
- `value`: `string`

### name: string
Returns `font-stretch`.

### `equals(other)`: `boolean`
Checks if `other` instance is equal to self.

#### Parameters:
- `other`: `StyleDeclaration`

### `getValue()`: `string`
Returns the string representation.

```js
new FontStretch("semi-condensed").getValue() // "semi-condensed"
```

## FontStyle

### `constructor(value)`: `FontStyle`
Creates `font-style` property instance with `value`. See [related docs](https://developer.mozilla.org/en-US/docs/Web/CSS/font-style).

#### Parameters:
- `value`: `string`

### name: string
Returns `font-style`.

### `equals(other)`: `boolean`
Checks if `other` instance is equal to self.

#### Parameters:
- `other`: `StyleDeclaration`

### `getValue()`: `string`
Returns the string representation.

```js
new FontStyle("oblique").getValue() // "oblique"
```

## FontWeight

### `constructor(value)`: `FontWeight`
Creates `font-weight` property instance with `value`. See [related docs](https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight).

#### Parameters:
- `value`: `number`

### name: string
Returns `font-weight`.

### `equals(other)`: `boolean`
Checks if `other` instance is equal to self.

#### Parameters:
- `other`: `StyleDeclaration`

### `getValue()`: `string`
Returns the string representation.

```js
new FontWeight(200).getValue() // "200"
```

## Height

### `constructor(length)`: `Height`
Creates `height` property instance with `length`. See [related docs](https://developer.mozilla.org/en-US/docs/Web/CSS/height).

#### Parameters:
- `length`: [`Length`](./values.md#length).

### name: string
Returns `height`.

### `equals(other)`: `boolean`
Checks if `other` instance is equal to self.

#### Parameters:
- `other`: `StyleDeclaration`

### `getValue(params, varibles)`: `string`
Returns the string representation.

#### Parameters:
- `params`: An instance conforming to [`LengthParams`](./types.md#lengthparams).
- `variables`: A [`VariableMap`](./types.md#variablemap) instance.

```js
new Height(new Length(12)).getValue({ densityDivisor: 2 }) // "6px"
```

## LetterSpacing

### `constructor(value)`: `LetterSpacing`
Creates `letter-spacing` property instance with `length`. See [related docs](https://developer.mozilla.org/en-US/docs/Web/CSS/letter-spacing).

#### Parameters:
- `value`: `number`

### name: string
Returns `letter-spacing`.

### `equals(other)`: `boolean`
Checks if `other` instance is equal to self.

#### Parameters:
- `other`: `StyleDeclaration`

### `getValue(params, varibles)`: `string`
Returns the string representation.

#### Parameters:
- `params`: An instance conforming to [`LengthParams`](./types.md#lengthparams).
- `variables`: A [`VariableMap`](./types.md#variablemap) instance.

```js
new LetterSpacing(4).getValue({ densityDivisor: 2 }) // "2px"
```

## LineHeight

### `constructor(value, fontSize)`: `LineHeight`
Creates `line-height` property instance with `length`. See [related docs](https://developer.mozilla.org/en-US/docs/Web/CSS/line-height).

#### Parameters:
- `value`: `number`
- `fontSize`: `number`

### name: string
Returns `line-height`.

### `equals(other)`: `boolean`
Checks if `other` instance is equal to self.

#### Parameters:
- `other`: `StyleDeclaration`

### `getValue(params, varibles)`: `string`
Returns the string representation.

#### Parameters:
- `params`: An instance conforming to [`LengthParams`](./types.md#lengthparams).
- `variables`: A [`VariableMap`](./types.md#variablemap) instance.

```js
new LineHeight(24, 18).getValue({ densityDivisor: 2 }) // "12px"
```

## MixBlendMode

### `constructor(value)`: `MixBlendMode`
Creates `mix-blend-mode` property instance with `value`. See [related docs](https://developer.mozilla.org/en-US/docs/Web/CSS/mix-blend-mode).

#### Parameters:
- `value`: `string`

### name: string
Returns `mix-blend-mode`.

### `equals(other)`: `boolean`
Checks if `other` instance is equal to self.

#### Parameters:
- `other`: `StyleDeclaration`

### `getValue()`: `string`
Returns the string representation.

```js
new MixBlendMode("multiply").getValue() // "multiply"
```

## Mixin

### `constructor(id)`: `MixBlendMode`
Creates an instance with `id`.

#### Parameters:
- `id`: `string`

### identifier: string
Returns the identifier.

## ObjectFit

### `constructor(value)`: `ObjectFit`
Creates `object-fit` property instance with `value`. See [related docs](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit).

#### Parameters:
- `value`: `string`

### name: string
Returns `object-fit`.

### `equals(other)`: `boolean`
Checks if `other` instance is equal to self.

#### Parameters:
- `other`: `StyleDeclaration`

### `getValue()`: `string`
Returns the string representation.

```js
new ObjectFit("contain").getValue() // "contain"
```

## Opacity

### `constructor(value)`: `Opacity`
Creates `opacity` property instance with `value`. See [related docs](https://developer.mozilla.org/en-US/docs/Web/CSS/opacity).

#### Parameters:
- `value`: [`Scalar`](./values.md#scalar).

### name: string
Returns `opacity`.

### `equals(other)`: `boolean`
Checks if `other` instance is equal to self.

#### Parameters:
- `other`: `StyleDeclaration`

### `getValue()`: `string`
Returns the string representation.

```js
new Opacity(new Scalar(0.1)).getValue() // "0.1"
```

## Shadow

### `constructor(shadowObjects, type)`: `Shadow`
Creates `text-shadow` or `box-shadow` property instance with `shadowObjects`, based on the value of `type`. See [related docs](https://developer.mozilla.org/en-US/docs/Web/CSS/text-shadow).

#### Parameters:
- `shadowObjects`: Array of `ExtensionModels.Shadow` instances.
- `type`: `string` that specifies the type, `box` or `text`.

### name: string
Returns `text-shadow` or `box-shadow` based on `type`.

### `equals(other)`: `boolean`
Checks if `other` instance is equal to self.

#### Parameters:
- `other`: `StyleDeclaration`

### `getValue(params, varibles)`: `string`
Returns the string representation.

#### Parameters:
- `params`: An instance conforming to [`ColorParams`](./types.md#colorparams) and [`LengthParams`](./types.md#lengthparams).
- `variables`: A [`VariableMap`](./types.md#variablemap) instance.

```js
new Shadow([shadow], "box").getValue({ densityDivisor: 2, colorFormat: "rgb" }) // "0 1px 2px 0 rgba(158, 12, 12, 0.5)"
```

## TextAlign

### `constructor(value)`: `TextAlign`
Creates `text-align` property instance with `value`. See [related docs](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align).

#### Parameters:
- `value`: `string`

### name: string
Returns `text-align`.

### `equals(other)`: `boolean`
Checks if `other` instance is equal to self.

#### Parameters:
- `other`: `StyleDeclaration`

### `getValue()`: `string`
Returns the string representation.

```js
new TextAlign("right").getValue() // "right"
```

## TextFillColor

### `constructor(value)`: `TextFillColor`
Creates `text-align` property with `value`. See [related docs](https://developer.mozilla.org/en-US/docs/Web/CSS/-webkit-text-fill-color).

#### Parameters:
- `value`: `string`

### name: string
Returns `-webkit-text-fill-color`.

### `equals(other)`: `boolean`
Checks if `other` instance is equal to self.

#### Parameters:
- `other`: `StyleDeclaration`

### `getValue()`: `string`
Returns the string representation.

```js
new TextFillColor("transparent").getValue() // "transparent"
```

## TextStroke

### `constructor(length, color)`: `TextStroke`
Creates `text-stroke` property instance with `length` and `color`. See [related docs](https://developer.mozilla.org/en-US/docs/Web/CSS/-webkit-text-stroke).

☝️ _Requires `-webkit` prefix._

#### Parameters:
- `length`: [`Length`](./values.md#length).
- `color`: [`Color`](./values.md#color).

### name: string
Returns `text-stroke`.

### `equals(other)`: `boolean`
Checks if `other` instance is equal to self.

#### Parameters:
- `other`: `StyleDeclaration`

### `getValue(params, varibles)`: `string`
Returns the string representation.

#### Parameters:
- `params`: An instance conforming to [`ColorParams`](./types.md#colorparams) and [`LengthParams`](./types.md#lengthparams).
- `variables`: A [`VariableMap`](./types.md#variablemap) instance.

```js
new TextStroke(new Length(3), black).getValue({ densityDivisor: 2, colorFormat: "hex" }) // "1.5px #000000"
```

## Transform

### `constructor(functions)`: `Filter`
Creates `transform` property instance with transformation `functions`. See [related docs](https://developer.mozilla.org/en-US/docs/Web/CSS/transform).

#### Parameters:
- `functions`: Array of [`StyleFunction`](./types.md#stylefunction) instances.

### name: string
Returns `transform`.

### `equals(other)`: `boolean`
Checks if `other` instance is equal to self.

#### Parameters:
- `other`: `StyleDeclaration`

### `getValue(params)`: `string`
Returns the string representation.

#### Parameters:
- `params`: An instance conforming to [`StyleParams`](./types.md#styleparams).

```js
new Transform([{ fn: "rotate", args: [new Angle(30, "deg")] }]).getValue() // "rotate(30deg)"
```

## Width

### `constructor(length)`: `Width`
Creates `width` property instance with `length`. See [related docs](https://developer.mozilla.org/en-US/docs/Web/CSS/width).

#### Parameters:
- `length`: [`Length`](./values.md#length).

### name: string
Returns `width`.

### `equals(other)`: `boolean`
Checks if `other` instance is equal to self.

#### Parameters:
- `other`: `StyleDeclaration`

### `getValue(params, varibles)`: `string`
Returns the string representation.

#### Parameters:
- `params`: An instance conforming to [`LengthParams`](./types.md#lengthparams).
- `variables`: A [`VariableMap`](./types.md#variablemap) instance.

```js
new Width(new Length(120)).getValue({ densityDivisor: 2 }) // "60px"
```

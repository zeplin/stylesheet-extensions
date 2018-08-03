# Declarations
Declarations represent CSS properties. Every property has a name and a value (formed using one or more [`StyleValue`](./values.md#stylevalue) instances) All the declarations have a common interface called `StyleDeclaration`:
 - [StyleDeclaration](./declarations.md#styledeclaration)
 - [BackdropFilter](./declarations.md#backdropfilter)
 - [BackgroundBlendMode](./declarations.md#backgroundblendmode)
 - [BackgroundClip](./declarations.md#backgroundclip)
 - [BackgroundColor](./declarations.md#backgroundcolor)
 - [BackgroundImage](./declarations.md#backgroundimage)
 - [BackgroundOrigin](./declarations.md#backgroundorigin)
 - [Border](./declarations.md#border)
 - [BorderImageSlice](./declarations.md#borderimageslice)
 - [BorderImageSource](./declarations.md#borderimagesource)
 - [BorderRadius](./declarations.md#borderradius)
 - [BorderStyle](./declarations.md#borderstyle)
 - [BorderWidth](./declarations.md#borderwidth)
 - [Color](./declarations.md#color)
 - [Filter](./declarations.md#filter)
 - [FontSize](./declarations.md#fontsize)
 - [FontStretch](./declarations.md#fontstretch)
 - [FontStyle](./declarations.md#fontstyle)
 - [FontWeight](./declarations.md#fontweight)
 - [Height](./declarations.md#height)
 - [LetterSpacing](./declarations.md#letterspacing)
 - [LineHeight](./declarations.md#lineheight)
 - [MixBlendMode](./declarations.md#mixblendmode)
 - [Mixin](./declarations.md#mixin)
 - [ObjectFit](./declarations.md#objectfit)
 - [Opacity](./declarations.md#opacity)
 - [Shadow](./declarations.md#shadow)
 - [TextAlign](./declarations.md#textalign)
 - [TextFillColor](./declarations.md#textfillcolor)
 - [TextStroke](./declarations.md#textstroke)
 - [Transform](./declarations.md#transform)
 - [Width](./declarations.md#width)

## StyleDeclaration
Forms the base interface for all style properties.

### `name`: `string`
Name of the property (e.g, `background-color`).

### `equals(other: StyleDeclaration)`: `boolean`
Given an `other` declaration instance, this method determines if `other` equals to the self.

#### Parameters:
 - `other`: An instance conforming to `StyleDeclaration` interface.

### `getValue(params, variables)`: `string`
This method returns the string that forms the value of the property.

#### Parameters:
 - `params`: An instance conforming to [`StyleParams`](./types.md#styleparams) interface. These parameters determines the how internal values are being interpreted when string output is generated. More details can be found in [`StyleParams`](./types.md#styleparams).
 - `variables`: An instance of [`VariableMap`](./types.md#variablemap). This map is used to replace literal values if there is a variable declared with the same value.

## BackdropFilter
### `constructor(filters)`: `BackdropFilter`
Creates `backdrop-filter` property with filter functions provided in `filters`. See [related docs](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter).

#### Parameters:
 - `filters`: Array of [`StyleFunction`](./types.md#stylefunction) instances.

### name: string
Returns `backdrop-filter`

### `equals(other)`: `boolean`
Equality check.

#### Parameters:
 - `other`: `StyleDeclaration`

### `getValue(params)`: `string`
Returns the string representation of the value.

#### Parameters:
 - `params`: An instance conforming to [`StyleParams`](./types.md#styleparams) interface.

```js
new BackdropFilter([
    { fn: "blur", args: [new Length(12, "px")] },
    { fn: "saturate", args: [new Percent(35)] }
]).getValue({ densityDivisor: 2 })

// returns => "blur("6px") saturate(35%)"
```

## BackgroundBlendMode
### `constructor(values)`: `BackgroundBlendMode`
Creates `background-blend-mode` property with `values`. See [related docs](https://developer.mozilla.org/en-US/docs/Web/CSS/background-blend-mode).

#### Parameters:
 - `values`: Array of `string` values.

### name: string
Returns `background-blend-mode`

### `equals(other)`: `boolean`
Equality check.

#### Parameters:
 - `other`: `StyleDeclaration`

### `getValue()`: `string`
Returns the string representation of the value.

```js
new BgBlendMode(["darken", "luminosity"]).getValue()

// returns => "darken, luminosity"
```

## BackgroundClip
### `constructor(values)`: `BackgroundClip`
Creates `background-clip` property with `values`. See [related docs](https://developer.mozilla.org/en-US/docs/Web/CSS/background-clip).

#### Parameters:
 - `values`: Array of `string` values.

### name: string
Returns `background-clip`

### `equals(other)`: `boolean`
Equality check.

#### Parameters:
 - `other`: `StyleDeclaration`

### `getValue()`: `string`
Returns the string representation of the value.

```js
new BgClip(["content-box"]).getValue()

// returns => "content-box"
```

## BackgroundColor
### `constructor(color)`: `BackgroundColor`
Creates `background-color` property with `color`. See [related docs](https://developer.mozilla.org/en-US/docs/Web/CSS/background-color).

#### Parameters:
 - `color`: [`Color`](./values.md#color).

### name: string
Returns `background-color`

### `equals(other)`: `boolean`
Equality check.

#### Parameters:
 - `other`: `StyleDeclaration`

### `getValue(params, varibles)`: `string`
Returns the string representation of the value.

#### Parameters:
 - `params`: An instance conforming to [`ColorParams`](./types.md#colorparams) interface.
 - `variables`: [`VariableMap`](./types.md#variablemap) instance.

```js
const white = new Color(...);
new BgColor(white).getValue({ colorFormat: "hex" })

// returns => "#ffffff"

const black = new Color(...);
new BgColor(black).getValue({ colorFormat: "rgb" })

// returns => "rgb(0, 0, 0)"

new BgColor(black).getValue({ colorFormat: "rgb" }, variables)

// returns => "var(--black)"
```

## BackgroundImage
### `constructor(images)`: `BackgroundImage`
Creates `background-image` property with `images`. See [related docs](https://developer.mozilla.org/en-US/docs/Web/CSS/background-image).

#### Parameters:
 - `images`: Array of [`Gradient`](./values.md#gradient) instances.

### name: string
Returns `background-image`

### `equals(other)`: `boolean`
Equality check.

#### Parameters:
 - `other`: `StyleDeclaration`

### `getValue(params, varibles)`: `string`
Returns the string representation of the value.

#### Parameters:
 - `params`: An object conforming to [`ColorParams`](./types.md#colorparams) interface.
 - `variables`: [`VariableMap`](./types.md#variablemap) object.

```js
const gradient = new Gradient(...);
new BgImage([gradient])).getValue({ colorFormat: "rgb" })

// returns => "linear-gradient(to right, rgb(48, 35, 174), rgb(83, 160, 253) 48%, rgb(180, 236, 81))"
```

## BackgroundOrigin
### `constructor(values)`: `BackgroundOrigin`
Creates `background-origin` property with `values`. See [related docs](https://developer.mozilla.org/en-US/docs/Web/CSS/background-origin).

#### Parameters:
 - `values`: Array of `string` values.

### name: string
Returns `background-origin`

### `equals(other)`: `boolean`
Equality check.

#### Parameters:
 - `other`: `StyleDeclaration`

### `getValue()`: `string`
Returns the string representation of the value.

```js
new BgClip(["content-box"]).getValue()

// returns => "content-box"
```

## Border
### `constructor({ style, width, color })`: `Border`
Creates `border` property with `color`. See [related docs](https://developer.mozilla.org/en-US/docs/Web/CSS/border).

#### Parameters:
 - `style`: `string`, denotes the border style ("solid", "dashed", etc.).
 - `width`: [`Length`](./values.md#length).
 - `color`: [`Color`](./values.md#color).

### name: string
Returns `border`

### `equals(other)`: `boolean`
Equality check.

#### Parameters:
 - `other`: `StyleDeclaration`

### `getValue(params, varibles)`: `string`
Returns the string representation of the value.

#### Parameters:
 - `params`: An instance conforming to [`ColorParams`](./types.md#colorparams) and [`LengthParams`](./types.md#lengthparams) interface.
 - `variables`: [`VariableMap`](./types.md#variablemap) instance.

```js
new Border({
    style: "solid",
    width: new Length(2, "px"),
    color: black
}).getValue({ densityDivisor: 2, colorFormat: "hex" })

// returns => "solid 1px #000000"
```

## BorderImageSlice
### `constructor(value)`: `BorderImageSlice`
Creates `border-image-slice` property with `value`. See [related docs](https://developer.mozilla.org/en-US/docs/Web/CSS/border-image-slice).

#### Parameters:
 - `value`: [`Scalar`](./values.md#scalar).

### name: string
Returns `border-image-slice`

### `equals(other)`: `boolean`
Equality check.

#### Parameters:
 - `other`: `StyleDeclaration`

### `getValue()`: `string`
Returns the string representation of the value.

```js
new BorderImageSlice(new Scalar(1)).getValue()

// returns => "1"
```

## BorderImageSource
### `constructor(images)`: `BorderImageSource`
Creates `BorderImageSource` property with `images`. See [related docs](https://developer.mozilla.org/en-US/docs/Web/CSS/border-image-source).

#### Parameters:
 - `images`: Array of [`Gradient`](./values.md#gradient) instances.

### name: string
Returns `border-image-source`

### `equals(other)`: `boolean`
Equality check.

#### Parameters:
 - `other`: `StyleDeclaration`

### `getValue(params, varibles)`: `string`
Returns the string representation of the value.

#### Parameters:
 - `params`: An object conforming to [`ColorParams`](./types.md#colorparams) interface.
 - `variables`: [`VariableMap`](./types.md#variablemap) object.

```js
const gradient = new Gradient(...);
new BorderImageSource([gradient])).getValue({ colorFormat: "rgb" })

// returns => "linear-gradient(to right, rgb(48, 35, 174), rgb(83, 160, 253) 48%, rgb(180, 236, 81))"
```

## BorderRadius
### `constructor(length)`: `BorderRadius`
Creates `border-radius` property with `length`. See [related docs](https://developer.mozilla.org/en-US/docs/Web/CSS/border-radius).

#### Parameters:
 - `length`: [`Length`](./values.md#length).

### name: string
Returns `border-radius`

### `equals(other)`: `boolean`
Equality check.

#### Parameters:
 - `other`: `StyleDeclaration`

### `getValue(params, varibles)`: `string`
Returns the string representation of the value.

#### Parameters:
 - `params`: An instance conforming to [`LengthParams`](./types.md#lengthparams) interface.
 - `variables`: [`VariableMap`](./types.md#variablemap) instance.

```js
new BorderRadius(new Length(22, "px")).getValue({ densityDivisor: 2 })

// returns => "11px"
```

## BorderStyle
### `constructor(value)`: `BorderStyle`
Creates `border-style` property with `value`. See [related docs](https://developer.mozilla.org/en-US/docs/Web/CSS/border-style).

#### Parameters:
 - `value`: `string`

### name: string
Returns `border-style`

### `equals(other)`: `boolean`
Equality check.

#### Parameters:
 - `other`: `StyleDeclaration`

### `getValue()`: `string`
Returns the string representation of the value.

```js
new BorderStyle("dashed").getValue()

// returns => "dashed"
```

## BorderWidth
### `constructor(length)`: `BorderWidth`
Creates `border-width` property with `length`. See [related docs](https://developer.mozilla.org/en-US/docs/Web/CSS/border-width).

#### Parameters:
 - `length`: [`Length`](./values.md#length).

### name: string
Returns `border-width`

### `equals(other)`: `boolean`
Equality check.

#### Parameters:
 - `other`: `StyleDeclaration`

### `getValue(params, varibles)`: `string`
Returns the string representation of the value.

#### Parameters:
 - `params`: An instance conforming to [`LengthParams`](./types.md#lengthparams) interface.
 - `variables`: [`VariableMap`](./types.md#variablemap) instance.

```js
new BorderWidth(new Length(2, "px")).getValue({ densityDivisor: 1 })

// returns => "2px"
```

## FontColor
### `constructor(color)`: `FontColor`
Creates `color` property from `color` argument. See [related docs](https://developer.mozilla.org/en-US/docs/Web/CSS/color).

#### Parameters:
 - `color`: [`Color`](./values.md#color) instance.

### name: string
Returns `color`

### `equals(other)`: `boolean`
Equality check.

#### Parameters:
 - `other`: `StyleDeclaration`

### `getValue(params, varibles)`: `string`
Returns the string representation of the value.

#### Parameters:
 - `params`: An object conforming to [`ColorParams`](./types.md#colorparams) interface.
 - `variables`: [`VariableMap`](./types.md#variablemap) object.

```js
const black = new Color(...);
new FontColor(gradient)).getValue({ colorFormat: "rgb" })

// returns => "rgb(0, 0, 0)"
```

## Filter
### `constructor(filters)`: `Filter`
Creates `filter` property with filter functions provided in `filters`. See [related docs](https://developer.mozilla.org/en-US/docs/Web/CSS/filter).

#### Parameters:
 - `filters`: Array of [`StyleFunction`](./types.md#stylefunction) instances.

### name: string
Returns `filter`

### `equals(other)`: `boolean`
Equality check.

#### Parameters:
 - `other`: `StyleDeclaration`

### `getValue(params)`: `string`
Returns the string representation of the value.

#### Parameters:
 - `params`: An instance conforming to [`StyleParams`](./types.md#styleparams) interface.

```js
new Filter([
    { fn: "blur", args: [new Length(12, "px")] },
    { fn: "saturate", args: [new Percent(35)] }
]).getValue({ densityDivisor: 2 })

// returns => "blur("6px") saturate(35%)"
```

## FontSize
### `constructor(length)`: `FontSize`
Creates `font-size` property with `length`. See [related docs](https://developer.mozilla.org/en-US/docs/Web/CSS/font-size).

#### Parameters:
 - `length`: [`Length`](./values.md#length).

### name: string
Returns `font-size`

### `equals(other)`: `boolean`
Equality check.

#### Parameters:
 - `other`: `StyleDeclaration`

### `getValue(params, varibles)`: `string`
Returns the string representation of the value.

#### Parameters:
 - `params`: An instance conforming to [`LengthParams`](./types.md#lengthparams) interface.
 - `variables`: [`VariableMap`](./types.md#variablemap) instance.

```js
new FontSize(new Length(12, "px")).getValue({ densityDivisor: 1 })

// returns => "12px"
```

## FontStretch
### `constructor(value)`: `FontStretch`
Creates `font-stretch` property with `value`. See [related docs](https://developer.mozilla.org/en-US/docs/Web/CSS/font-stretch).

#### Parameters:
 - `value`: `string`

### name: string
Returns `font-stretch`

### `equals(other)`: `boolean`
Equality check.

#### Parameters:
 - `other`: `StyleDeclaration`

### `getValue()`: `string`
Returns the string representation of the value.

```js
new FontStretch("semi-condensed").getValue()

// returns => "semi-condensed"
```

## FontStyle
### `constructor(value)`: `FontStyle`
Creates `font-style` property with `value`. See [related docs](https://developer.mozilla.org/en-US/docs/Web/CSS/font-style).

#### Parameters:
 - `value`: `string`

### name: string
Returns `font-style`

### `equals(other)`: `boolean`
Equality check.

#### Parameters:
 - `other`: `StyleDeclaration`

### `getValue()`: `string`
Returns the string representation of the value.

```js
new FontStyle("oblique").getValue()

// returns => "oblique"
```

## FontWeight
### `constructor(value)`: `FontWeight`
Creates `font-weight` property with `value`. See [related docs](https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight).

#### Parameters:
 - `value`: `number`

### name: string
Returns `font-weight`

### `equals(other)`: `boolean`
Equality check.

#### Parameters:
 - `other`: `StyleDeclaration`

### `getValue()`: `string`
Returns the string representation of the value.

```js
new FontWeight(200).getValue()

// returns => "200"
```

## Height
### `constructor(length)`: `Height`
Creates `height` property with `length`. See [related docs](https://developer.mozilla.org/en-US/docs/Web/CSS/height).

#### Parameters:
 - `length`: [`Length`](./values.md#length).

### name: string
Returns `height`

### `equals(other)`: `boolean`
Equality check.

#### Parameters:
 - `other`: `StyleDeclaration`

### `getValue(params, varibles)`: `string`
Returns the string representation of the value.

#### Parameters:
 - `params`: An instance conforming to [`LengthParams`](./types.md#lengthparams) interface.
 - `variables`: [`VariableMap`](./types.md#variablemap) instance.

```js
new Height(new Length(12, "px")).getValue({ densityDivisor: 2 })

// returns => "6px"
```

## LetterSpacing
### `constructor(length)`: `LetterSpacing`
Creates `letter-spacing` property with `length`. See [related docs](https://developer.mozilla.org/en-US/docs/Web/CSS/letter-spacing).

#### Parameters:
 - `length`: [`Length`](./values.md#length).

### name: string
Returns `letter-spacing`

### `equals(other)`: `boolean`
Equality check.

#### Parameters:
 - `other`: `StyleDeclaration`

### `getValue(params, varibles)`: `string`
Returns the string representation of the value.

#### Parameters:
 - `params`: An instance conforming to [`LengthParams`](./types.md#lengthparams) interface.
 - `variables`: [`VariableMap`](./types.md#variablemap) instance.

```js
new LetterSpacing(new Length(4, "px")).getValue({ densityDivisor: 2 })

// returns => "2px"
```

## LineHeight
### `constructor(length)`: `LineHeight`
Creates `line-height` property with `length`. See [related docs](https://developer.mozilla.org/en-US/docs/Web/CSS/line-height).

#### Parameters:
 - `length`: [`Length`](./values.md#length).

### name: string
Returns `line-height`

### `equals(other)`: `boolean`
Equality check.

#### Parameters:
 - `other`: `StyleDeclaration`

### `getValue(params, varibles)`: `string`
Returns the string representation of the value.

#### Parameters:
 - `params`: An instance conforming to [`LengthParams`](./types.md#lengthparams) interface.
 - `variables`: [`VariableMap`](./types.md#variablemap) instance.

```js
new LineHeight(new Length(24, "px")).getValue({ densityDivisor: 2 })

// returns => "12px"
```

## MixBlendMode
### `constructor(value)`: `MixBlendMode`
Creates `mix-blend-mode` property with `value`. See [related docs](https://developer.mozilla.org/en-US/docs/Web/CSS/mix-blend-mode).

#### Parameters:
 - `value`: `string`

### name: string
Returns `mix-blend-mode`

### `equals(other)`: `boolean`
Equality check.

#### Parameters:
 - `other`: `StyleDeclaration`

### `getValue()`: `string`
Returns the string representation of the value.

```js
new MixBlendMode("multiply").getValue()

// returns => "multiply"
```

## Mixin
### `constructor(id)`: `MixBlendMode`
Creates a mixin object with `id`.

#### Parameters:
 - `id`: `string`

### identifier: string
Returns identifier of the mixin.

## ObjectFit
### `constructor(value)`: `ObjectFit`
Creates `object-fit` property with `value`. See [related docs](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit).

#### Parameters:
 - `value`: `string`

### name: string
Returns `object-fit`

### `equals(other)`: `boolean`
Equality check.

#### Parameters:
 - `other`: `StyleDeclaration`

### `getValue()`: `string`
Returns the string representation of the value.

```js
new ObjectFit("contain").getValue()

// returns => "contain"
```

## Opacity
### `constructor(value)`: `Opacity`
Creates `opacity` property with `value`. See [related docs](https://developer.mozilla.org/en-US/docs/Web/CSS/opacity).

#### Parameters:
 - `value`: [`Scalar`](./values.md#scalar).

### name: string
Returns `opacity`

### `equals(other)`: `boolean`
Equality check.

#### Parameters:
 - `other`: `StyleDeclaration`

### `getValue()`: `string`
Returns the string representation of the value.

```js
new Opacity(new Scalar(0.1)).getValue()

// returns => "0.1"
```

## Shadow
### `constructor(shadowObjects, type)`: `Shadow`
Creates `text-shadow` or `box-shadow` property with `shadowObjects` depending on the value of `type`. See [related docs](https://developer.mozilla.org/en-US/docs/Web/CSS/text-shadow).

#### Parameters:
 - `shadowObjects`: Array of `ExtensionModels.Shadow` instances.
 - `type`: `string` that specifies the type of shadow (box or text).

### name: string
Returns `text-shadow` or `box-shadow` depending on the value of `type`

### `equals(other)`: `boolean`
Equality check.

#### Parameters:
 - `other`: `StyleDeclaration`

### `getValue(params, varibles)`: `string`
Returns the string representation of the value.

#### Parameters:
 - `params`: An instance conforming to [`ColorParams`](./types.md#colorparams) and [`LengthParams`](./types.md#lengthparams) interface.
 - `variables`: [`VariableMap`](./types.md#variablemap) instance.

```js
new Shadow([shadow], "box").getValue({ densityDivisor: 2, colorFormat: "rgb" })

// returns => "0 1px 2px 0 rgba(158, 12, 12, 0.5)"
```

## TextAlign
### `constructor(value)`: `TextAlign`
Creates `text-align` property with `value`. See [related docs](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align).

#### Parameters:
 - `value`: `string`

### name: string
Returns `text-align`

### `equals(other)`: `boolean`
Equality check.

#### Parameters:
 - `other`: `StyleDeclaration`

### `getValue()`: `string`
Returns the string representation of the value.

```js
new TextAlign("right").getValue()

// returns => "right"
```

## TextFillColor
### `constructor(value)`: `TextFillColor`
Creates `text-align` property with `value`. See [related docs](https://developer.mozilla.org/en-US/docs/Web/CSS/-webkit-text-fill-color).

#### Parameters:
 - `value`: `string`

### name: string
Returns `-webkit-text-fill-color`

### `equals(other)`: `boolean`
Equality check.

#### Parameters:
 - `other`: `StyleDeclaration`

### `getValue()`: `string`
Returns the string representation of the value.

```js
new TextFillColor("transparent").getValue()

// returns => "transparent"
```

## TextStroke
### `constructor(length, color)`: `TextStroke`
Creates `text-stroke` property with `length` and `color`. It should be prefixed with `-webkit`. See [related docs](https://developer.mozilla.org/en-US/docs/Web/CSS/-webkit-text-stroke).

#### Parameters:
 - `length`: [`Length`](./values.md#length).
 - `color`: [`Color`](./values.md#color).

### name: string
Returns `text-stroke`

### `equals(other)`: `boolean`
Equality check.

#### Parameters:
 - `other`: `StyleDeclaration`

### `getValue(params, varibles)`: `string`
Returns the string representation of the value.

#### Parameters:
 - `params`: An instance conforming to [`ColorParams`](./types.md#colorparams) and [`LengthParams`](./types.md#lengthparams) interface.
 - `variables`: [`VariableMap`](./types.md#variablemap) instance.

```js
new TextStroke(new Length(3, "px"), black).getValue({ densityDivisor: 2, colorFormat: "hex" })

// returns => "1.5px #000000"
```

## Transform
### `constructor(functions)`: `Filter`
Creates `transform` property with transformation functions listed in `functions`. See [related docs](https://developer.mozilla.org/en-US/docs/Web/CSS/transform).

#### Parameters:
 - `functions`: Array of [`StyleFunction`](./types.md#stylefunction) instances.

### name: string
Returns `transform`

### `equals(other)`: `boolean`
Equality check.

#### Parameters:
 - `other`: `StyleDeclaration`

### `getValue(params)`: `string`
Returns the string representation of the value.

#### Parameters:
 - `params`: An instance conforming to [`StyleParams`](./types.md#styleparams) interface.

```js
new Transform([{ fn: "rotate", args: [new Angle(30, "deg")] }]).getValue()

// returns => "rotate(30deg)"
```

## Width
### `constructor(length)`: `Width`
Creates `width` property with `length`. See [related docs](https://developer.mozilla.org/en-US/docs/Web/CSS/width).

#### Parameters:
 - `length`: [`Length`](./values.md#length).

### name: string
Returns `width`

### `equals(other)`: `boolean`
Equality check.

#### Parameters:
 - `other`: `StyleDeclaration`

### `getValue(params, varibles)`: `string`
Returns the string representation of the value.

#### Parameters:
 - `params`: An instance conforming to [`LengthParams`](./types.md#lengthparams) interface.
 - `variables`: [`VariableMap`](./types.md#variablemap) instance.

```js
new Width(new Length(120, "px")).getValue({ densityDivisor: 2 })

// returns => "60px"
```
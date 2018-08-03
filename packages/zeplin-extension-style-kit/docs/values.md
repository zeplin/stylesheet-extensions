# Values
Values represent CSS values used in properties. They are parametric models that can be constructed using the required parameters that define the value itself. For example, [`Length`](./values.md#length) needs a value (magnitude) and a unit. All the values have a common interface called `StyleValue`.

## StyleValue
Forms the base interface for all style values.

### `equals(other: StyleValue)`: `boolean`
Given an `other` value instance, this method determines if `other` equals to the self.

#### Parameters:
 - `other`: An instance conforming to `StyleValue` interface.

### `toStyleValue(params, variables)`: `string`
This method serializes the instance to in CSS value format.

#### Parameters:
 - `params`: An instance conforming to [`StyleParams`](./types.md#styleparams) interface. These parameters determines the how internal values are being interpreted when string output is generated. More details can be found in [`StyleParams`](./types.md#styleparams).
 - `variables`: An instance of [`VariableMap`](./types.md#variablemap). This map is used to replace literal values if there is a variable declared with the same value.


## Angle
### `constructor(value, unit = "deq")`: `Angle`
Creates an angle value. See [related docs](https://developer.mozilla.org/en-US/docs/Web/CSS/angle).

#### Parameters:
 - `value`: A `number` that denotes the value of the angle.
 - `unit`: A `string` that denotes the unit of the angle (default: `deg`).

### `equals(other: Angle)`: `boolean`
Equality check.

### `toStyleValue()`: `string`
Returns the string representation of `Angle` value.

```js
new Angle(13, "rad").toStyleValue() // "13rad"
```

## Color
### `constructor(colorObject)`: `Color`
Creates color value. See [related docs](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value).

#### Parameters:
 - `colorObject`: An instance of [`ExtensionModels.Color`](https://github.com/zeplin/zeplin-extension-documentation/blob/master/model/color.md)

### `equals(other)`: `boolean`
Equality check.

### `toGradient`(): [`Gradient`](./values.md#gradient)
This method returns a `Gradient` object with two color stops whose color is equal to this value.

### `toStyleValue(params, variables)`: `string`
Returns the string representation of `Color` value in the format specified with `params.colorFormat`.

#### Parameters:
 - `params`: An instance conforming to [`ColorParams`](./types.md#colorparams) interface.
 - `variables`: An instance of [`VariableMap`](./types.md#variablemap).

## Gradient
### `constructor(gradientObject)`: `Color`
Creates color value. See [related docs](https://developer.mozilla.org/en-US/docs/Web/CSS/gradient).

#### Parameters:
 - `gradientObject`: An instance of [`ExtensionModels.Gradient`](https://github.com/zeplin/zeplin-extension-documentation/blob/master/model/gradient.md)

### `static fromRGBA(rgba)`: [`Gradient`](./values.md#gradient)
This method returns a `Gradient` object with two color stops whose color has `rgba` value.

#### Parameters:
 - `rgba`: An object with `r`, `g,` `b`, and properties. `{r, g, b}` values have [0, 255] interval where has `a` should be in [0, 1].

### `equals(other: Gradient)`: `boolean`
Equality check.

### `toStyleValue(params, variables)`: `string`
Returns the string representation of `Gradient` in which color values are represented in the format specified with `params.colorFormat`.

#### Parameters:
 - `params`: An instance conforming to [`ColorParams`](./types.md#colorparams) interface.
 - `variables`: An instance of [`VariableMap`](./types.md#variablemap).

```js
new Color(extensionColorWhite).toStyleValue({ colorFormat: "hex" }) // "#ffffff"
new Color(extensionColorWhite25).toStyleValue({ colorFormat: "rgb" }) // "rgba(255, 255, 255, 0.25)"
new Color(extensionColorWhite25).toStyleValue(
    { colorFormat: "rgb" },
    {
        "rgba(255, 255, 255, 0.25)": "var(--white-25pc)"
    }
) // "var(--white-25pc)"
```

## Length
### `constructor(value, unit = "px")`: `Length`
Creates a length value. See [related docs](https://developer.mozilla.org/en-US/docs/Web/CSS/length).

#### Parameters:
 - `value`: A `number` that denotes the value of the length.
 - `unit`: A `string` that denotes the unit of the length (default: `px`).

### `equals(other)`: `boolean`
Equality check.

### `toStyleValue(params)`: `string`
Returns the string representation of `Angle` value.

#### Parameters:
 - `params`: An instance conforming to [`LengthParams`](./types.md#lengthparams) interface.

```js
new Color(22, "px").toStyleValue({ densityDivisor: 1 }) // "22px"
new Color(22, "px").toStyleValue({ densityDivisor: 2 }) // "11px"
```

## Percent
### `constructor(value)`: `Percent`
Creates a length value. See [related docs](https://developer.mozilla.org/en-US/docs/Web/CSS/percentage).

#### Parameters:
 - `value`: A `number` that denotes the value of the percentage. It should be in [0, 1] interval.

### `equals(other)`: `boolean`
Equality check.

### `toStyleValue()`: `string`
Returns the string representation of `Percent` value.

```js
new Percent(0.22).toStyleValue() // "22%"
new Percent(0).toStyleValue() // "0"
```

## Scalar
### `constructor(value, unit = "px")`: `Scalar`
Creates a length value. See [related docs](https://developer.mozilla.org/en-US/docs/Web/CSS/number).

#### Parameters:
 - `value`: A `number` that denotes the value of the length.
 - `unit`: A `string` that denotes the unit of the length (default: `px`).

### `equals(other)`: `boolean`
Equality check.

### `toStyleValue()`: `string`
Returns the string representation of `Scalar` value.

```js
new Color(22).toStyleValue({ densityDivisor: 1 }) // "22px"
```
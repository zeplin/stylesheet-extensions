# Values

Values represent CSS values used in properties. They are parametric models that can be constructed using the required parameters, e.g [`Length`](./values.md#length) requires a value (magnitude) and a unit. All values have a common interface called `StyleValue`.

## StyleValue

Base interface for all style values.

### `valueOf()`: `string`
Returns the primitive value for the `StyleValue` instance.

### `equals(other: StyleValue)`: `boolean`
Checks if `other` instance is equal to self.

#### Parameters:
- `other`: An instance conforming to `StyleValue`.

### `toStyleValue(params, variables)`: `string`
Serializes to in CSS value format.

#### Parameters:
- `params`: An instance conforming to [`StyleParams`](./types.md#styleparams). These parameters determine how internal values are being interpreted when string output is generated. See [`StyleParams`](./types.md#styleparams) to learn more.
- `variables`: An instance of [`VariableMap`](./types.md#variablemap). This map is used to replace literal values if there is a variable declared with the same value.

## Angle

### `constructor(value, unit = "deg")`: `Angle`
Creates an instance. See [related docs](https://developer.mozilla.org/en-US/docs/Web/CSS/angle).

#### Parameters:
- `value`: A `number` that represents the value.
- `unit`: A `string` that represents the unit, `deg` (default) or `rad`.

### `equals(other: Angle)`: `boolean`
Checks if `other` instance is equal to self.

### `toStyleValue()`: `string`
Returns the string representation.

```js
new Angle(13, "rad").toStyleValue() // "13rad"
```

## Color

### `constructor(colorObject)`: `Color`
Creates an instance from an extension color instance. See [related docs](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value).

#### Parameters:
- `colorObject`: An instance of [`ExtensionModels.Color`](https://github.com/zeplin/zeplin-extension-documentation/blob/master/model/color.md).

### `equals(other)`: `boolean`
Checks if `other` instance is equal to self.

### `toGradient`(): [`Gradient`](./values.md#gradient)
Returns a `Gradient` instance with two color stops equal to self.

### `toStyleValue(params, variables)`: `string`
Returns the string representation, in the format specified in `params.colorFormat`.

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

#### Parameters:
- `params`: An instance conforming to [`ColorParams`](./types.md#colorparams).
- `variables`: An instance of [`VariableMap`](./types.md#variablemap).

## Gradient

### `constructor(gradientObject)`: `Color`
Creates an instance from an extension gradient instance. See [related docs](https://developer.mozilla.org/en-US/docs/Web/CSS/gradient).

#### Parameters:
 - `gradientObject`: An instance of [`ExtensionModels.Gradient`](https://github.com/zeplin/zeplin-extension-documentation/blob/master/model/gradient.md).

### `static fromRGBA(rgba)`: [`Gradient`](./values.md#gradient)
Returns a `Gradient` instance with two color stops equal to `rgba`.

#### Parameters:
- `rgba`: An object with `r`, `g,` `b`, and `a` properties. `r`, `g`, `b` values should be between 0 and 255, where `a` should be between 0 and 1.

### `equals(other: Gradient)`: `boolean`
Checks if `other` instance is equal to self.

### `toStyleValue(params, variables)`: `string`
Returns the string representation, in which colors are in the format specified in `params.colorFormat`.

#### Parameters:
 - `params`: An instance conforming to [`ColorParams`](./types.md#colorparams).
 - `variables`: An instance of [`VariableMap`](./types.md#variablemap).

## Length

### `constructor(value, options)`: `Length`
Creates an instance with unit of `px`. See [related docs](https://developer.mozilla.org/en-US/docs/Web/CSS/length).

#### Parameters:
- `value`: A `number` that represents the value.
- `options`: An optional `Object` that defines the configuration for styling.
- `options.precison`: A `number` that represents the precision, `2` by default.
- `options.useRemUnit`: A `boolean` that decides rem usage along with `lengthParams`. The value can be also a `function` that takes `remPreferences` as argument and decides the rem usage, `false` by default.
- `options.useDensityDivisor`: A `boolean` that decides usage of along with `lengthParams`, `true` by default.

### `equals(other)`: `boolean`
Checks if `other` instance is equal to self.

### `toStyleValue(params)`: `string`
Returns the string representation.

#### Parameters:
- `params`: An instance conforming to [`LengthParams`](./types.md#lengthparams).

```js
new Length(22).toStyleValue({ densityDivisor: 1 }); // "22px"
new Length(22).toStyleValue({ densityDivisor: 2 }); // "11px"
new Length(22, { useDensityDivisor: false }).toStyleValue({ densityDivisor: 2 }); // "22px"
new Length(22, { useRemUnit: true }).toStyleValue({ densityDivisor: 1, remPreferences: { rootFontSize: 11 }}); // "1rem"
new Length(22, { useRemUnit: true }).toStyleValue({ densityDivisor: 1 }); // "22px" since `rootFontSize` is not set
new Length(22, { useRemUnit: () => true }).toStyleValue({ densityDivisor: 1, remPreferences: { rootFontSize: 11 }}); // "1rem"
new Length(22, { useRemUnit: ({ useForFontSizes }) => useForFontSizes }).toStyleValue({ densityDivisor: 1, remPreferences: { rootFontSize: 11, useForFontSizes: true }  }); // "1rem"
new Length(22, { useRemUnit: ({ useForFontSizes }) => useForFontSizes }).toStyleValue({ densityDivisor: 1, remPreferences: { rootFontSize: 11 }  }); // "22px"
```

## Percent

### `constructor(value)`: `Percent`
Creates an instance. See [related docs](https://developer.mozilla.org/en-US/docs/Web/CSS/percentage).

#### Parameters:
- `value`: A `number` that represents the value, between 0 and 1.

### `equals(other)`: `boolean`
Checks if `other` instance is equal to self.

### `toStyleValue()`: `string`
Returns the string representation.

```js
new Percent(0.22).toStyleValue(); // "22%"
new Percent(0).toStyleValue(); // "0"
```

## Scalar

### `constructor(value, precison = 2)`: `Scalar`
Creates an instance. See [related docs](https://developer.mozilla.org/en-US/docs/Web/CSS/number).

#### Parameters:
- `value`: A `number` that represents the value.
- `precison`: A `number` that represents the precision, `2` by default.

### `equals(other)`: `boolean`
Checks if `other` instance is equal to self.

### `toStyleValue()`: `string`
Returns the string representation.

```js
new Scalar(22).toStyleValue({ densityDivisor: 1 }) // "22px"
```

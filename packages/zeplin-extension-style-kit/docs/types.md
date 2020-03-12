# Common types

## StyleParams

Style parameters include all possible parameters that can be used by any [value](./values.md) or [declaration](./declarations.md).

### `densityDivisor`: `number`
Returns the pixel density of the design.

### `colorFormat`: `string`
Returns the format specifier for color values, `hex`, `rgb`, and `hsl`.

### `unitlessLineHeight`: `boolean`
Returns `true` if the `line-height` property should be unitless.

## ColorParams

Color parameters only include `colorFormat`, used when only color related parameters are required.

## LengthParams

Length parameters include `densityDivisor` and `remPreferences`, used when only parameters that affect length values are required.

## RemPreferences

Rem preferences include `useForFontSize` `useForMeasurements` and `rootFontSize`, used for rem usage.


## StyleFunction

Style function represents functions, e.g. `scaleX(0.7)`.

### `fn`: `string`
Returns the name of the function.

### `args`: [`Array<StyleValue>`](./values.md#stylevalue)
Returns the arguments of the function.

## VariableMap

Variable map is a specialized object structure whose keys are the values assigned to the variables and the values are variables' identifiers.

```js
const variableMap = {
    "#000000": "black",
    "12px": "default-line-height"
};
```

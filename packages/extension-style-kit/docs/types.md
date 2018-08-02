# Common types

## StyleParams
This includes all the possible parameters that can be used by any [values](./values.md) or [props](./props.md).

### `densityDivisor`: `number`
This number represents the pixel density assumed in the design data.

### `colorFormat`: `string`
Format specifier for the color values. Possible options: "hex", "rgb", and "hsl".

### `unitlessLineHeight: boolean
It controls `line-height` property to be unitless or not.

## ColorParams
This includes only `colorFormat` parameter. It's used when color related parameters are required.

## LengthParams
This includes only `densityDivisor` parameter. It's used when parameters that affect length values are required.

## StyleFunction
This represents style functions (e.g., `scaleX(0.7)`) with two properties:

### `fn`: `string`
Name of the function.

### `args`: [`Array<StyleValue>`](./values.md#stylevalue)
Arguments to the style function.

## VariableMap
This is a specialized object structure whose keys are the values assigned to the variables and the values are variables' identifiers. For example:
```js
const variableMap = {
    "#000000": "black",
    "12px": "default-line-height"
};
```
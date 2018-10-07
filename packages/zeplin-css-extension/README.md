# Zeplin CSS Extension

Generates CSS snippets from colors, text styles and layers. ⚛️📱

Sample colors output:
```css
:root {
  --blue: #0000ff;
  --yellow: #ffff00;
  --green: #00ff00;
  --black: #000000;
  --black50: rgba(0, 0, 0, 0.5);
  --white: #ffffff;
  --red: #ff0000;
}
```

Sample text style output:
```css
.Sample-text-style {
  font-family: Roboto;
  font-size: 20px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: var(--black);
}

.Sample-text-style-with-color {
  font-family: Roboto;
  font-size: 20px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: var(--red);
}
```

Sample layer output:
```css
.Layer-with-shadow {
  width: 100px;
  height: 100px;
  box-shadow: 0 2px 4px 6px var(--black50);
}
```

## Options

#### Color format

Supports HEX, RGB or HSL. Sample colors output as HSL:
```css
:root {
  --blue: hsl(240, 100%, 50%);
  --black50: hsla(0, 0%, 0%, 0.5);
}
```

#### Dimensions

Toggles generating `width` and `height` properties from layers.

#### Unitless line-height

Toggles generating unitless value for `line-height` property.

#### Default values

Toggles always generating default values from layers or text styles, such as `fontWeight` and `fontStyle`.

## Development

CSS extension is developed using [zem](https://github.com/zeplin/zem), Zeplin Extension Manager. zem is a command line tool that lets you quickly create and test extensions.

To learn more about zem, [see documentation](https://github.com/zeplin/zem).

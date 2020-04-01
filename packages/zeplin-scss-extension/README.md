# Zeplin SCSS Extension

Generates SCSS snippets from colors, text styles and layers. ⚛️📱

## Output
Sample colors output:
```scss
$red: #ff0000;
$green: #00ff00;
$blue: #0000ff;
$yellow: #ffff00;
$black: #000000;
$black50: rgba(0, 0, 0, 0.5);
$white: #ffffff;
```

Sample text style output:
```scss
@mixin Sample-text-style-with-color {
  font-family: SFProText;
  font-size: 20px;
  text-align: left;
  color: $red;
}

@mixin Sample-text-style {
  font-family: SFProText;
  font-size: 20px;
  text-align: left;
}
```

Sample layer output:
```scss
.Layer-with-shadow {
  width: 100px;
  height: 100px;
  box-shadow: 0 2px 4px 6px $black50;
}
```

## Options

#### Color format

Supports HEX, RGB or HSL. Sample colors output as HSL:
```scss
$blue: hsl(240, 100%, 50%)
$black50: hsla(0, 0%, 0%, 0.5)
```

#### Dimensions

Toggles generating `width` and `height` properties from layers.

#### Unitless line-height

Toggles generating unitless value for `line-height` property.

#### Text styles as mixins

Toggles using project text styles as mixins while generating code for text layers.

Sample output when this options disabled:
```scss
.Text-layer {
  width: 220px;
  height: 24px;
  font-family: SFProText;
  font-size: 20px;
  text-align: left;
  color: $black;
}
```

When enabled:
```scss
.Text-layer {
  width: 220px;
  height: 24px;
  color: $black;
  @include Sample-text-style;
}
```

#### Default values

Toggles always generating default values from layers or text styles, such as `fontWeight` and `fontStyle`.

## Development

SCSS extension is developed using [zem](https://github.com/zeplin/zem), Zeplin Extension Manager. zem is a command line tool that lets you quickly create and test extensions.

To learn more about zem, [see documentation](https://github.com/zeplin/zem).

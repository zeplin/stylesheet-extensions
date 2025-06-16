# Zeplin Sass Extension

Generates Sass snippets from colors, text styles and layers. ⚛️📱

## Output
Sample colors output:
```sass
$blue: #0000ff
$yellow: #ffff00
$green: #00ff00
$black: #000000
$black50: rgba(0, 0, 0, 0.5)
$white: #ffffff
$red: #ff0000
```

Sample text style output:
```sass
=Sample-text-style-with-color()
  font-family: SFProText
  font-size: 20px
  text-align: left
  color: $red

=Sample-text-style()
  font-family: SFProText
  font-size: 20px
  text-align: left
```

Sample layer output:
```sass
.Layer-with-shadow
  width: 100px
  height: 100px
  box-shadow: 0 2px 4px 6px $black50
```

## Options

#### Color format

Supports HEX, RGB or HSL. Sample colors output as HSL:
```sass
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
```sass
.Text-layer
  width: 220px
  height: 24px
  font-family: SFProText
  font-size: 20px
  text-align: left
  color: $black
```

When enabled:
```sass
.Text-layer
  width: 220px
  height: 24px
  color: $black
  +Sample-text-style()
```

#### Default values

Toggles always generating default values from layers or text styles, such as `fontWeight` and `fontStyle`.

## Development

Sass extension is developed using [zem](https://github.com/zeplin/zem) and [@zeplin/extension-model](https://zeplin.github.io/extension-model/), Zeplin Extension Manager. zem is a command line
tool that lets you quickly create and test extensions.

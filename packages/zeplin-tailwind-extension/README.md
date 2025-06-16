# Zeplin Tailwind Extension

Generates Tailwind snippets from colors, text styles and layers. ⚛️📱

## Output

Sample colors output:

```css
@template {  
  --color-*: initial;
  --color-blue: #0000ff;
  --color-yellow: #ffff00;
  --color-green: #00ff00;
  --color-black: #000000;
  --color-black50: rgba(0, 0, 0, 0.5);
  --color-white: #ffffff;
  --color-red: #ff0000;
}
```

Sample text style output:

```css
@theme {
    /* Font families */
    --font-instrument-sans: InstrumentSans;
    --font-open-sans: OpenSans;
    /* Font weights */
    --font-normal: normal;
    --font-bold: bold;
    --font-semibold: 600;
    /* Font sizes */
    --text-12: 12px;
    --text-14: 14px;
    ...
}
```

Sample layer output:

```css
<div class="w-xl h-m mb-6 bg-black50 rounded-lg">
</div>

```

## Options

#### Color format

Supports HEX, RGB or HSL. Sample colors output as HSL:

```css
@template {
  --color-blue: hsl(240, 100%, 50%);
  --color-black50: hsla(0, 0%, 0%, 0.5);
}
```

#### Dimensions

Toggles generating `width` and `height` properties from layers.

#### Unitless line-height

Toggles generating unitless value for `line-height` property.

#### Default values

Toggles always generating default values from layers or text styles, such as `fontWeight` and `fontStyle`. Default is false.

## Development

Tailwind extension is developed using [zem](https://github.com/zeplin/zem) and [@zeplin/extension-model](https://zeplin.github.io/extension-model/), Zeplin Extension Manager. zem is a command line
tool that lets you quickly create and test extensions.

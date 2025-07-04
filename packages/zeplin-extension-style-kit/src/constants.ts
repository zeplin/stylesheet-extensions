const STYLE_PROPS = {
    FONT_FAMILY: "font-family",
    FONT_SIZE: "font-size",
    FONT_WEIGHT: "font-weight",
    FONT_COLOR: "color",
    FONT_STYLE: "font-style",
    FONT_STRETCH: "font-stretch",
    FONT_VARIATION_SETTINGS: "font-variation-settings",
    FONT_SRC: "src",
    LINE_HEIGHT: "line-height",
    LETTER_SPACING: "letter-spacing",
    TEXT_ALIGN: "text-align",
    COLOR: "color",
    WIDTH: "width",
    HEIGHT: "height",
    OBJECT_FIT: "object-fit",
    TRANSFORM: "transform",
    OPACITY: "opacity",
    BLEND_MODE: "mix-blend-mode",
    BORDER_RADIUS: "border-radius",
    BACKGROUND_BLEND_MODE: "background-blend-mode",
    BACKGROUND_IMAGE: "background-image",
    BACKGROUND_COLOR: "background-color",
    TEXT_SHADOW: "text-shadow",
    BOX_SHADOW: "box-shadow",
    BORDER: "border",
    BORDER_TOP: "border-top",
    BORDER_RIGHT: "border-right",
    BORDER_BOTTOM: "border-bottom",
    BORDER_LEFT: "border-left",
    BACKGROUND_ORIGIN: "background-origin",
    BACKGROUND_CLIP: "background-clip",
    TEXT_STROKE: "text-stroke",
    BORDER_STYLE: "border-style",
    BORDER_WIDTH: "border-width",
    BORDER_IMAGE_SOURCE: "border-image-source",
    BORDER_IMAGE_SLICE: "border-image-slice",
    BACKDROP_FILTER: "backdrop-filter",
    FILTER: "filter",
    TEXT_FILL_COLOR: "text-fill-color",
    MARGIN: "margin",
    PADDING: "padding",
    DISPLAY: "display",
    FLEX_DIRECTION: "flex-direction",
    FLEX_GROW: "flex-grow",
    JUSTIFY_CONTENT: "justify-content",
    ALIGN_ITEMS: "align-items",
    ALIGN_SELF: "align-self",
    GAP: "gap"
} as const;

const OPTION_NAMES = {
    USE_LINKED_STYLEGUIDES: "useLinkedStyleguides",
    COLOR_FORMAT: "colorFormat",
    VARIABLE_NAME_FORMAT: "variableNameFormat",
    SHOW_DEFAULT_VALUES: "showDefaultValues",
    SHOW_DIMENSIONS: "showDimensions",
    UNITLESS_LINE_HEIGHT: "unitlessLineHeight",
    MIXIN: "mixin",
    USE_REM_UNIT: "useRemUnit",
    SHOW_PADDING_MARGIN: "showPaddingMargin"
} as const;

export { OPTION_NAMES, STYLE_PROPS };

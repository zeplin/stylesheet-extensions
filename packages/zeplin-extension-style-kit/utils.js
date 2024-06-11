import cssEscape from "css.escape";
import FontFace from "./elements/fontFace";
import { OPTION_NAMES } from "./constants";

const TEXT_RELATED_TAGS = [
    "a", "abbr", "address", "article", "aside", "b", "bdi", "bdo", "blockquote", "button", "caption", "cite", "code",
    "data", "dd", "del", "details", "dfn", "dialog", "div", "dt", "em", "figcaption", "footer", "h1", "h2", "h3", "h4",
    "h5", "h6", "header", "i", "input", "ins", "kbd", "label", "legend", "li", "link", "main", "mark", "meter", "nav",
    "option", "output", "p", "pre", "q", "rp", "rt", "ruby", "s", "samp", "section", "slot", "small", "span", "strong",
    "sub", "summary", "sup", "td", "textarea", "th", "time", "u", "var"
];

const HTML_TAGS = [
    ...TEXT_RELATED_TAGS,
    "audio", "body", "canvas", "datalist", "dl", "embed", "fieldset", "figure", "form", "iframe", "noscript", "ol",
    "optgroup", "progress", "select", "table", "tbody", "tfoot", "thead", "tr", "ul"
];

function isHtmlTag(str) {
    return HTML_TAGS.includes(str.toLowerCase());
}

function isTextRelatedTag(str) {
    return TEXT_RELATED_TAGS.includes(str.toLowerCase());
}

const NOT_INHERITED_PROPS = [
    "-webkit-background-clip",
    "background-clip",
    "-webkit-text-fill-color"
];

function isDeclarationInherited(declaration) {
    return !NOT_INHERITED_PROPS.includes(declaration);
}

function blendColors(colors) {
    return colors.reduce((blendedColor, color) => blendedColor.blend(color));
}
function lowercaseFirst(s) {
    return s.charAt(0).toLowerCase() + s.substring(1);
}

function uppercaseFirst(s) {
    return s.charAt(0).toUpperCase() + s.substring(1);
}

function joinTokens(components, namingScheme) {
    switch (namingScheme) {
        case "constant":
            return components.map(val => val.toUpperCase()).join("_");
        case "snake":
            return components.join("_");
        case "pascal":
            return components.map(uppercaseFirst).join("");
        case "camel":
            return lowercaseFirst(components.map(uppercaseFirst).join(""));
        default:
        case "kebab":
            return components.join("-");
    }
}

function tokensForString(str) {
    var tokenizer = /\d+|[a-z]+|[A-Z]+(?![a-z])|[A-Z][a-z]+/g;

    var matchResult = str.match(tokenizer);
    if (!matchResult) {
        return ["invalid", "name"];
    }

    return matchResult.map(function (token) {
        return token.toLowerCase();
    });
}

function generateVariableName(name, namingScheme) {
    if (namingScheme === "none") {
        return name.replace(/[^\w-]/g, "");
    }
    return joinTokens(tokensForString(name), namingScheme);
}

function generateIdentifier(str) {
    let escapedStr = str.trim()
        .replace(/[^\s\w-]/g, "")
        .replace(/^(-?\d+)+/, "")
        .replace(/\s+/g, "-");

    if (cssEscape) {
        escapedStr = cssEscape(escapedStr);
    }

    return escapedStr;
}

function selectorize(str) {
    if (!str) {
        return "";
    }

    let selectorizedStr = str.trim();

    if (isHtmlTag(selectorizedStr)) {
        return selectorizedStr.toLowerCase();
    }

    if (/^[#.]/.test(selectorizedStr)) {
        const name = generateIdentifier(selectorizedStr.substr(1));

        if (name) {
            return selectorizedStr[0] + name;
        }
    }

    selectorizedStr = generateIdentifier(selectorizedStr);
    return selectorizedStr && `.${selectorizedStr}`;
}

function webkit(Declaration) {
    return class {
        constructor(...args) {
            this.instance = new Declaration(...args);
        }

        get name() {
            return `-webkit-${this.instance.name}`;
        }

        equals(other) {
            return this.instance.equals(other.instance || other);
        }

        getValue(params) {
            return this.instance.getValue(params);
        }
    };
}

function getUniqueLayerTextStyles(layer) {
    const uniqueTextStyles = [];

    layer.textStyles.forEach(({ textStyle }) => {
        const found = uniqueTextStyles.some(textStyle.equals, textStyle);

        if (found) {
            return;
        }

        uniqueTextStyles.push(textStyle);
    });

    return uniqueTextStyles;
}

function getFontFaces(textStyles) {
    const textStyleSet = [];

    textStyles.forEach(textStyle => {
        if (textStyleSet.find(ts => ts.fontFace === textStyle.fontFace)) {
            return;
        }

        textStyleSet.push(textStyle);
    });

    return textStyleSet.sort(FontFace.comparator);
}

function getResourceContainer(context) {
    if (context.styleguide) {
        return {
            container: context.styleguide,
            type: "styleguide"
        };
    }

    return {
        container: context.project,
        type: "project"
    };
}

function getLinkedResources(container, type, resourceKey) {
    let resources = container[resourceKey];
    let itContainer = type === "project" ? container.linkedStyleguide : container.parent;
    while (itContainer) {
        if (itContainer[resourceKey]) {
            resources = [...resources, ...itContainer[resourceKey]];
        }

        itContainer = itContainer.parent;
    }
    return resources;
}

function getResources({ context, useLinkedStyleguides, key }) {
    const { container, type } = getResourceContainer(context);
    if (useLinkedStyleguides) {
        return getLinkedResources(container, type, key);
    }

    return container[key];
}

function getParams(context) {
    const { container } = getResourceContainer(context);
    return {
        densityDivisor: container.densityDivisor,
        useLinkedStyleguides: context.getOption(OPTION_NAMES.USE_LINKED_STYLEGUIDES),
        colorFormat: context.getOption(OPTION_NAMES.COLOR_FORMAT),
        variableNameFormat: context.getOption(OPTION_NAMES.VARIABLE_NAME_FORMAT),
        showDimensions: context.getOption(OPTION_NAMES.SHOW_DIMENSIONS),
        showDefaultValues: context.getOption(OPTION_NAMES.SHOW_DEFAULT_VALUES),
        unitlessLineHeight: context.getOption(OPTION_NAMES.UNITLESS_LINE_HEIGHT),
        useMixin: context.getOption(OPTION_NAMES.MIXIN),
        remPreferences: context.getOption(OPTION_NAMES.USE_REM_UNIT) && container.remPreferences,
        showPaddingMargin: context.getOption(OPTION_NAMES.SHOW_PADDING_MARGIN)
    };
}

function getUniqueFirstItems(array, equalityFunction = (x, y) => x === y) {
    return array.filter(
        (item, i, arr) => i === arr.findIndex(searchedItem => equalityFunction(item, searchedItem))
    );
}

function generateColorNameResolver({ container, useLinkedStyleguides, formatVariableName }) {
    return color => {
        const matchedColor = container.findColorEqual(color, useLinkedStyleguides);
        if (matchedColor) {
            return formatVariableName(matchedColor);
        }
    };
}

function generateLinkedColorVariableNameResolver({ container, useLinkedStyleguides, colorFormat, formatVariableName }) {
    return (color, shouldDisplayDefaultValue) => {
        const matchedColor = container.findLinkedColorVariableEqual(color, useLinkedStyleguides);
        if (matchedColor) {
            return formatVariableName(matchedColor, {
                defaultColorStringByFormat: shouldDisplayDefaultValue && getColorStringByFormat(color, colorFormat)
            });
        }
    };
}

function getVariableBySourceId(variableCollections) {
    return variableCollections
        .flatMap(({ groups, remote }) => groups
            .flatMap(({ variables }) => variables
                .flatMap(variable => {
                    variable.remote = remote;

                    return variable;
                })))
        .reduce((acc, variable) => {
            acc[variable.sourceId] = variable;

            return acc;
        }, {});
}

function getModeByModeId(variableCollections) {
    return variableCollections
        .flatMap(({ modes }) => modes
            .flatMap(mode => mode))
        .reduce((acc, mode) => {
            acc[mode.id] = mode;

            return acc;
        }, {});
}

function getColorDetailsFromVariableValue(variableValue, variableBySourceId, modeByModeId) {
    if (variableValue.type === "color" && variableValue.color) {
        return { colorValue: variableValue.color, isRemote: false };
    }

    if (!variableValue.variableSourceId) {
        return;
    }

    const modeName = modeByModeId[variableValue.modeId];
    const nestedVariable = variableBySourceId[variableValue.variableSourceId];
    if (!nestedVariable) {
        return;
    }

    let colorValue;
    let fallbackColorValue;
    for (const value of nestedVariable.values) {
        const nestedValueModeName = modeByModeId[value.modeId];
        // TODO: There might be a need to format mode names before comparing them.
        if (nestedValueModeName.name === modeName.name) {
            ({ colorValue } = getColorDetailsFromVariableValue(value, variableBySourceId, modeByModeId));
        } else if (!fallbackColorValue) {
            ({ colorValue: fallbackColorValue } = getColorDetailsFromVariableValue(
                value, variableBySourceId, modeByModeId
            ));
        }
    }

    return { colorValue: colorValue || fallbackColorValue, isRemote: nestedVariable.remote };
}

function setColorObjectsForVariable(variable, variableBySourceId, modeByModeId, colorDetailsByModeName) {
    for (const value of variable.values) {
        const { colorValue, isRemote } = getColorDetailsFromVariableValue(
            value, variableBySourceId, modeByModeId
        );

        const colorObject = value.generateColorObject(variable, colorValue);
        if (colorObject) {
            const mode = modeByModeId[value.modeId];
            if (colorDetailsByModeName[mode.name]) {
                colorDetailsByModeName[mode.name].push({
                    color: colorObject, shouldDisplayDefaultValue: isRemote
                });
            } else {
                colorDetailsByModeName[mode.name] = [{
                    color: colorObject, shouldDisplayDefaultValue: isRemote
                }];
            }
        }
    }
}

function generateColorDetailsByModeName(variableCollections) {
    if (!variableCollections) {
        return;
    }

    const colorDetailsByModeName = {};
    const variableBySourceId = getVariableBySourceId(variableCollections);
    const modeByModeId = getModeByModeId(variableCollections);

    for (const variableCollection of variableCollections) {
        if (!variableCollection.remote) {
            for (const group of variableCollection.groups) {
                for (const variable of group.variables) {
                    setColorObjectsForVariable(variable, variableBySourceId, modeByModeId, colorDetailsByModeName);
                }
            }
        }
    }

    return colorDetailsByModeName;
}

// Color related

const MAX_RGB_VALUE = 255;
const MAX_PERCENT = 100;
const MAX_ANGLE = 360;
const HEX_BASE = 16;

const alphaFormatter = new Intl.NumberFormat("en-US", {
    useGrouping: false,
    maximumFractionDigits: 2
});

function toHex(num) {
    let hexNum = Math.trunc(num + (num / MAX_RGB_VALUE));
    hexNum = Math.max(0, Math.min(hexNum, MAX_RGB_VALUE));

    return (hexNum < HEX_BASE ? "0" : "") + hexNum.toString(HEX_BASE);
}

function canBeShortHex(color) {
    const { r, g, b, a } = color.toHex();
    return r[0] === r[1] && g[0] === g[1] && b[0] === b[1] && a[0] === a[1];
}

function longHexToShort(hex) {
    return hex.split("").filter((_, i) => i % 2 === 0).join("");
}

function toHexString(color) {
    let hexCode = color.hexBase();

    if (color.a < 1) {
        hexCode += toHex(color.a * MAX_RGB_VALUE);
    }

    if (canBeShortHex(color)) {
        hexCode = longHexToShort(hexCode);
    }

    return `#${hexCode}`;
}

function toRGBAString(color) {
    const rgb = `${Math.round(color.r)}, ${Math.round(color.g)}, ${Math.round(color.b)}`;

    return color.a < 1
        ? `rgba(${rgb}, ${alphaFormatter.format(color.a)})`
        : `rgb(${rgb})`;
}

function toHSLString(color) {
    const hslColor = color.toHSL();
    const hsl = `${Math.round(hslColor.h * MAX_ANGLE)}, ${Math.round(hslColor.s * MAX_PERCENT)}%, ${Math.round(hslColor.l * MAX_PERCENT)}%`;

    return color.a < 1
        ? `hsla(${hsl}, ${alphaFormatter.format(color.a)})`
        : `hsl(${hsl})`;
}

function getColorStringByFormat(color, colorFormat) {
    if (!("r" in color && "g" in color && "b" in color && "a" in color)) {
        return "";
    }

    switch (colorFormat) {
        case "hex":
            return toHexString(color);

        case "rgb":
            return toRGBAString(color);

        case "hsl":
            return toHSLString(color);

        default:
            return color.a < 1 ? toRGBAString(color) : toHexString(color);
    }
}

export {
    blendColors,
    getUniqueLayerTextStyles,
    getFontFaces,
    isHtmlTag,
    isTextRelatedTag,
    isDeclarationInherited,
    selectorize,
    generateIdentifier,
    generateVariableName,
    webkit,
    getResources,
    getResourceContainer,
    getParams,
    getUniqueFirstItems,
    generateColorNameResolver,
    generateLinkedColorVariableNameResolver,
    generateColorDetailsByModeName,
    getColorStringByFormat
};

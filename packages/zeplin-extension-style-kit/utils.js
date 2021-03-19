import cssEscape from "css.escape";
import FontFace from "./elements/fontFace";
import { OPTION_NAMES } from "./constants";

const HTML_TAGS = [
    "a", "abbr", "address", "area", "article", "aside", "audio", "b", "base", "bdi",
    "bdo", "blockquote", "body", "br", "button", "canvas", "caption", "cite", "code",
    "col", "colgroup", "data", "datalist", "dd", "del", "details", "dfn", "dialog",
    "div", "dl", "dt", "em", "embed", "fieldset", "figcaption", "figure", "footer",
    "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr",
    "html", "i", "iframe", "img", "input", "ins", "kbd", "keygen", "label", "legend",
    "li", "link", "main", "map", "mark", "math", "menu", "menuitem", "meta", "meter",
    "nav", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param",
    "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "script",
    "section", "select", "slot", "small", "source", "source", "span", "strong", "style",
    "sub", "summary", "sup", "svg", "table", "tbody", "td", "template", "textarea",
    "tfoot", "th", "thead", "time", "title", "tr", "track", "u", "ul", "var", "video", "wbr"
];

function isHtmlTag(str) {
    return HTML_TAGS.includes(str.toLowerCase());
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
        resources = [...resources, ...itContainer[resourceKey]];
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

export {
    blendColors,
    getUniqueLayerTextStyles,
    getFontFaces,
    isHtmlTag,
    isDeclarationInherited,
    selectorize,
    generateIdentifier,
    generateVariableName,
    webkit,
    getResources,
    getResourceContainer,
    getParams,
    getUniqueFirstItems,
    generateColorNameResolver
};

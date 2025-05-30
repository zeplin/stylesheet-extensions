import { ColorFormat, NamingScheme, ContextParams, StyleDeclaration } from "./common";
import { Barrel, Color, Context, TextStyle, Layer, Styleguide, Project, VariableCollection, Variable, VariableMode, VariableValue } from "@zeplin/extension-model";
import { FontFace } from "./elements/fontFace";
import { OPTION_NAMES } from "./constants";
import cssEscape from "css.escape";

const TEXT_RELATED_TAGS = new Set([
    "a", "abbr", "address", "article", "aside", "b", "bdi", "bdo", "blockquote", "button", "caption", "cite", "code",
    "data", "dd", "del", "details", "dfn", "dialog", "div", "dt", "em", "figcaption", "footer", "h1", "h2", "h3", "h4",
    "h5", "h6", "header", "i", "input", "ins", "kbd", "label", "legend", "li", "link", "main", "mark", "meter", "nav",
    "option", "output", "p", "pre", "q", "rp", "rt", "ruby", "s", "samp", "section", "slot", "small", "span", "strong",
    "sub", "summary", "sup", "td", "textarea", "th", "time", "u", "var"
]);

const HTML_TAGS = new Set([
    ...TEXT_RELATED_TAGS,
    "audio", "body", "canvas", "datalist", "dl", "embed", "fieldset", "figure", "form", "iframe", "noscript", "ol",
    "optgroup", "progress", "select", "table", "tbody", "tfoot", "thead", "tr", "ul"
]);

const NOT_INHERITED_PROPS = new Set([
    "-webkit-background-clip",
    "background-clip",
    "-webkit-text-fill-color"
]);

/**
 * Checks if a string is a valid HTML tag
 * @param str - The string to check
 * @returns True if the string is a valid HTML tag
 */
function isHtmlTag(str: string): boolean {
    return HTML_TAGS.has(str.toLowerCase().trim());
}

/**
 * Checks if a string is a text-related HTML tag
 * @param str - The string to check
 * @returns True if the string is a text-related HTML tag
 */
function isTextRelatedTag(str: string): boolean {
    return TEXT_RELATED_TAGS.has(str.toLowerCase().trim());
}

/**
 * Checks if a CSS property is inherited by default
 * @param propName - The CSS property name to check
 * @returns True if the property is inherited
 */
function isDeclarationInherited(propName: string): boolean {
    return !NOT_INHERITED_PROPS.has(propName);
}

/**
 * Blends multiple colors together
 * @param colors - Array of Color objects to blend
 * @returns A new Color representing the blend
 */
function blendColors(colors: Color[]): Color {
    return colors.reduce((blendedColor, color) => blendedColor.blend(color));
}

function lowercaseFirst(s: string): string {
    return s.charAt(0).toLowerCase() + s.substring(1);
}

function uppercaseFirst(s: string): string {
    return s.charAt(0).toUpperCase() + s.substring(1);
}

function joinTokens(tokens: string[], namingScheme: NamingScheme): string {
    switch (namingScheme) {
        case "constant":
            return tokens.map(val => val.toUpperCase()).join("_");
        case "snake":
            return tokens.join("_");
        case "pascal":
            return tokens.map(uppercaseFirst).join("");
        case "camel":
            return lowercaseFirst(tokens.map(uppercaseFirst).join(""));
        default:
        case "kebab":
            return tokens.join("-");
    }
}

function tokensForString(str: string): string[] {
    const tokenizer = /\d+|[a-z]+|[A-Z]+(?![a-z])|[A-Z][a-z]+/g;

    const matchResult = str.match(tokenizer);
    if (!matchResult) {
        return ["invalid", "name"];
    }

    return matchResult.map(token => token.toLowerCase());
}

function generateVariableName(name: string, namingScheme: NamingScheme): string {
    return joinTokens(tokensForString(name), namingScheme);
}

function generateIdentifier(str: string): string {
    const escapedStr = str.trim()
        .replace(/[^\s\w-]/g, "")
        .replace(/^(-?\d+)+/, "")
        .replace(/\s+/g, "-");

    return cssEscape(escapedStr);
}

/**
 * Converts a string to a valid CSS selector
 * @param str - The string to convert
 * @returns A valid CSS selector
 */
function selectorize(str: string): string {
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

/**
 * Wraps a style declaration with -webkit- prefix
 * @param DeclaredClass - The style declaration class to wrap
 * @returns A new class that applies -webkit- prefixed versions
 */
function webkit<T extends new (...args: any[]) => StyleDeclaration>(DeclaredClass: T) {
    return class WebkitDeclaration extends (DeclaredClass as new (...args: any[]) => any) {
        originalName: string;

        constructor(...args: ConstructorParameters<T>) {
            super(...args);
            this.originalName = super.name;
        }

        get name(): string {
            return `-webkit-${super.name}`;
        }
    } as new (...args: ConstructorParameters<T>) => InstanceType<T> & { originalName: string };
}


/**
 * Gets unique text styles from a layer
 * @param layer - The layer to get text styles from
 * @returns Array of unique TextStyle objects
 */
function getUniqueLayerTextStyles(layer: Layer): TextStyle[] {
    const uniqueTextStyles: TextStyle[] = [];

    layer.textStyles?.forEach(({ textStyle }) => {
        const found = uniqueTextStyles.some(textStyle.equals, textStyle);

        if (found) {
            return;
        }

        uniqueTextStyles.push(textStyle);
    });

    return uniqueTextStyles;
}

function getFontFaces(textStyles: TextStyle[]): FontFace[] {
    const textStyleSet: FontFace[] = [];

    textStyles.forEach(textStyle => {
        if (textStyleSet.find(ts => ts.font.fontFace === textStyle.fontFace)) {
            return;
        }

        textStyleSet.push(new FontFace(textStyle));
    });

    return textStyleSet.sort(FontFace.comparator);
}

type ResourceType = "styleguide" | "project";
type ResourceContainer = { container: Barrel; type: ResourceType };
/**
 * Gets the resource container (styleguide) from a context
 * @param context - The context containing an optional styleguide
 * @returns The styleguide if available, otherwise undefined
 */
function getResourceContainer(
    context: Context
): ResourceContainer {
    if (context.styleguide) {
        return {
            container: context.styleguide,
            type: "styleguide"
        };
    }

    return {
        container: context.project!,
        type: "project"
    };
}

type ArrayBarrelKeys = NonNullable<{
    [K in keyof Barrel]: Barrel[K] extends any[] ? K : never;
}[keyof Barrel]>;

type BarrelKey = Exclude<ArrayBarrelKeys, "linkedStyleguide" | "parent">;

function getLinkedResources<T extends Barrel[BarrelKey]>
    ({ context, resourceFn }: {
        resourceFn: (b: Barrel) => T;
        context: Context;
    }): T {
    const { container, type } = getResourceContainer(context);
    let resources = resourceFn(container);
    let parentBarrel = type === "project" ? container.linkedStyleguide : container.parent;
    while (parentBarrel) {
        const linkedResources = resourceFn(parentBarrel);
        if (linkedResources) {
            resources = [...resources, ...linkedResources] as T;
        }

        parentBarrel = parentBarrel.parent;
    }
    return resources;
}

function getResources<T extends Barrel[BarrelKey]>({ context, useLinkedStyleguides, resourceFn }: {
    resourceFn: (b: Barrel) => T;
    context: Context;
    useLinkedStyleguides: boolean;
}): T {
    if (useLinkedStyleguides) {
        return getLinkedResources({
            context,
            resourceFn
        });
    }

    const { container } = getResourceContainer(context);
    return resourceFn(container);
}

function getParams(context: Context): ContextParams {
    const { container } = getResourceContainer(context);
    return {
        densityDivisor: container.densityDivisor,
        useLinkedStyleguides: context.getOption(OPTION_NAMES.USE_LINKED_STYLEGUIDES) as boolean,
        colorFormat: context.getOption(OPTION_NAMES.COLOR_FORMAT) as ColorFormat,
        variableNameFormat: context.getOption(OPTION_NAMES.VARIABLE_NAME_FORMAT) as NamingScheme,
        showDimensions: context.getOption(OPTION_NAMES.SHOW_DIMENSIONS) as boolean,
        showDefaultValues: context.getOption(OPTION_NAMES.SHOW_DEFAULT_VALUES) as boolean,
        unitlessLineHeight: context.getOption(OPTION_NAMES.UNITLESS_LINE_HEIGHT) as boolean,
        useMixin: context.getOption(OPTION_NAMES.MIXIN) as boolean,
        remPreferences: context.getOption(OPTION_NAMES.USE_REM_UNIT) ? container.remPreferences : undefined,
        showPaddingMargin:   context.getOption(OPTION_NAMES.SHOW_PADDING_MARGIN) as boolean
    };
}

/**
 * Gets unique items from an array based on a custom equality function
 * @param array - The array to process
 * @param equalityFunction - Function to determine item equality
 * @returns Array of unique items
 */
function getUniqueFirstItems<T>(
    array: T[],
    equalityFunction: (a: T, b: T) => boolean
): T[] {
    if (!Array.isArray(array)) return [];

    return array.filter((item, index, self) =>
        index === self.findIndex(other => equalityFunction(item, other))
    );
}

/**
 * Parameters for generating a color name resolver
 */
export interface GenerateColorNameFinderParams {
    /** The context containing the styleguide */
    container: Barrel;
    /** Whether to include linked styleguides */
    useLinkedStyleguides: boolean;
    /** Function to format variable names */
    formatVariableName: (color: Color, options?: { defaultColorStringByFormat?: string }) => string;
}

/**
 * Generates a function that resolves color names based on styleguide variables
 * @param params - Configuration parameters
 * @returns A function that resolves a color to its variable name
 */
function generateColorNameResolver(
    params: GenerateColorNameFinderParams
): (color: Color) => string {
    const { container, useLinkedStyleguides, formatVariableName } = params;

    return color => {
        const matchedColor = (container as Styleguide | Project).findColorEqual(color, useLinkedStyleguides);
        if (matchedColor) {
            return formatVariableName(matchedColor);
        }

        return "";
    };
}

/**
 * Parameters for generating a color name resolver
 */
export interface GenerateLinkedColorVariableNameFinderParams {
    /** The context containing the styleguide */
    container: Barrel;
    /** Whether to include linked styleguides */
    useLinkedStyleguides: boolean;
    /** Color format */
    colorFormat: ColorFormat;
    /** Function to format variable names */
    formatVariableName: (color: Color, options?: { defaultColorStringByFormat?: string }) => string;
}

function generateLinkedColorVariableNameResolver(params: GenerateLinkedColorVariableNameFinderParams) {
    const { container, useLinkedStyleguides, colorFormat, formatVariableName } = params;
    return (color: Color, shouldDisplayDefaultValue?: boolean): string => {
        const matchedColor = (container as Project | Styleguide).findLinkedColorVariableEqual(color, useLinkedStyleguides);
        if (matchedColor) {
            return formatVariableName(matchedColor, {
                defaultColorStringByFormat: shouldDisplayDefaultValue ? getColorStringByFormat(color, colorFormat) : undefined
            });
        }

        return "";
    };
}

type VariableWithRemote = Variable & {
    remote: boolean;
};

type ColorDetails = {
    colorValue?: {
        r: number;
        g: number;
        b: number;
        a: number;
    };
    isRemote: boolean;
};

function getVariableBySourceId(variableCollections: VariableCollection[]) {
    return variableCollections
        .flatMap(({ groups, remote }) => groups
            .flatMap(({ variables }) => variables
                .flatMap(variable => {
                    return {
                        ...variable,
                        remote
                    };
                })))
        .reduce((acc, variable) => {
            acc[variable.sourceId] = variable;

            return acc;
        }, {} as Record<string, VariableWithRemote>);
}

function getModeByModeId(variableCollections: VariableCollection[]) {
    return variableCollections
        .flatMap(({ modes }) => modes
            .flatMap(mode => mode))
        .reduce((acc, mode) => {
            acc[mode.id] = mode;

            return acc;
        }, {} as Record<string, VariableMode>);
}

function getColorDetailsFromVariableValue(
    variableValue: VariableValue,
    variableBySourceId: Record<string, VariableWithRemote>,
    modeByModeId: Record<string, VariableMode>
): ColorDetails | undefined {
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
            colorValue = getColorDetailsFromVariableValue(value, variableBySourceId, modeByModeId)?.colorValue;
        } else if (!fallbackColorValue) {
            fallbackColorValue = getColorDetailsFromVariableValue(value, variableBySourceId, modeByModeId)?.colorValue;
        }
    }

    return { colorValue: colorValue || fallbackColorValue, isRemote: nestedVariable.remote };
}

type ColorDetailsByModeName = Record<string, { color: Color; shouldDisplayDefaultValue: boolean }[]>;

function setColorObjectsForVariable(variable: Variable, variableBySourceId: Record<string, VariableWithRemote>, modeByModeId: Record<string, VariableMode>, colorDetailsByModeName: ColorDetailsByModeName) {
    for (const value of variable.values) {
        const { colorValue, isRemote } = getColorDetailsFromVariableValue(
            value, variableBySourceId, modeByModeId
        ) || {};

        if (colorValue && isRemote) {
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
}

function generateColorDetailsByModeName(variableCollections: VariableCollection[]): ColorDetailsByModeName | undefined {
    if (!variableCollections) {
        return;
    }

    const colorDetailsByModeName: ColorDetailsByModeName = {};
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


function getColorStringByFormat(color: Color, colorFormat: ColorFormat) {
    if (!("r" in color && "g" in color && "b" in color && "a" in color)) {
        return "";
    }

    switch (colorFormat) {
        case "hex":
            return color.toHexString();

        case "rgb":
            return color.toRGBAString();

        case "hsl":
            return color.toHSLString();

        default:
            return color.a < 1 ? color.toRGBAString() : color.toHexString();
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

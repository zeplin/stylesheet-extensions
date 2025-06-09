import { Barrel, Color as ExtensionColor } from "@zeplin/extension-model";
import {
    AtRule,
    Color,
    ContextParams,
    DeclarationOptions,
    generateColorNameResolver,
    generateLinkedColorVariableNameResolver,
    generateVariableName,
    Generator,
    isDeclarationInherited,
    RuleSet,
    RuleSetOptions,
    StyleDeclaration,
    StyleValue,
} from "zeplin-extension-style-kit";

const DEFAULT_NAME_PREFIX = "--";
const DEFAULT_SEPARATOR = ": ";
const DEFAULT_VALUE_SEPARATOR = ", ";
const DEFAULT_VALUE_SUFFIX = ";";
const INDENTATION = "  ";

export class CSSGenerator implements Generator {
    private readonly container: Barrel;
    private readonly params: ContextParams;
    private readonly declarationOptions: DeclarationOptions;

    constructor(container: Barrel, params: ContextParams, declarationOptions: DeclarationOptions = {
        namePrefix: DEFAULT_NAME_PREFIX,
        valueSuffix: DEFAULT_VALUE_SUFFIX,
        nameValueSeparator: DEFAULT_SEPARATOR
    }) {
        this.params = params;
        this.container = container;
        this.declarationOptions = declarationOptions;
    }

    formatColorVariable(color: ExtensionColor, options: { defaultColorStringByFormat?: string } = {}): string {
        let defaultColorValue = "";
        if (options && options.defaultColorStringByFormat) {
            defaultColorValue = `${DEFAULT_VALUE_SEPARATOR}${options.defaultColorStringByFormat}`;
        }

        return `var(${this.declarationOptions.namePrefix}${generateVariableName(
            color.originalName || color.name!, this.params.variableNameFormat
        )}${defaultColorValue})`;
    }

    filterDeclarations(childDeclarations: StyleDeclaration[], parentDeclarations: StyleDeclaration[]) {
        const { params: { showDefaultValues, showDimensions, showPaddingMargin } } = this;

        return childDeclarations.filter(declaration => {
            if (!showDimensions && (declaration.name === "width" || declaration.name === "height")) {
                return false;
            }

            if (!showPaddingMargin && (declaration.name === "margin" || declaration.name === "padding")) {
                return false;
            }

            const parentDeclaration = parentDeclarations.find(p => p.name === declaration.name);

            if (parentDeclaration) {
                if (!parentDeclaration.equals(declaration)) {
                    return true;
                }

                return !isDeclarationInherited(declaration.name);
            }

            if (declaration.hasDefaultValue && declaration.hasDefaultValue()) {
                return showDefaultValues;
            }

            return true;
        });
    }

    declaration(d: StyleDeclaration): string {
        const { valueSuffix, nameValueSeparator } = this.declarationOptions;

        const value = d.getValue(
            this.params,
            generateColorNameResolver({
                container: this.container,
                useLinkedStyleguides: this.params.useLinkedStyleguides,
                formatVariableName: (color, options) => this.formatColorVariable(color, options)
            })
        );

        return `${INDENTATION}${d.name}${nameValueSeparator}${value}${valueSuffix}`;
    }

    declarationsBlock(declarations: StyleDeclaration[] = []): string {
        return `{\n${declarations.map(this.declaration, this).join("\n")}\n}`;
    }

    variable(name: string, value: StyleValue): string {
        const { namePrefix, valueSuffix, nameValueSeparator } = this.declarationOptions;

        const generatedName = generateVariableName(name, this.params.variableNameFormat);

        let colorNameResolver;
        if (value instanceof Color && value.object && value.object.linkedVariableSourceId) {
            colorNameResolver = generateLinkedColorVariableNameResolver({
                container: this.container,
                useLinkedStyleguides: this.params.useLinkedStyleguides,
                colorFormat: this.params.colorFormat,
                formatVariableName: (color, options) => this.formatColorVariable(color, options)
            });
        }

        const variableValue = value.toStyleValue(this.params, colorNameResolver);

        return `${namePrefix}${generatedName}${nameValueSeparator}${variableValue}${valueSuffix}`;
    }

    ruleSet({ selector, declarations }: RuleSet, { parentDeclarations = [], scope = "" }: RuleSetOptions = {}): string {
        const filteredDeclarations = this.filterDeclarations(declarations, parentDeclarations);
        const ruleSelector = scope ? `${scope} ${selector}` : selector;

        if (!filteredDeclarations.length) {
            return "";
        }

        return `${ruleSelector} ${this.declarationsBlock(filteredDeclarations)}`;
    }

    atRule({ identifier, declarations }: AtRule): string {
        return `@${identifier} ${this.declarationsBlock(declarations)}`;
    }
}

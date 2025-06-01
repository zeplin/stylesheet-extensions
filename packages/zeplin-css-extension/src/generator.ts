import { Barrel, Color as ExtensionColor } from "@zeplin/extension-model";
import {
    AtRule,
    Color,
    ContextParams,
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

const PREFIX = "--";
const SEPARATOR = ": ";
const DEFAULT_VALUE_SEPARATOR = ", ";
const SUFFIX = ";";
const INDENTATION = "  ";

export class CSSGenerator implements Generator {
    private readonly container: Barrel;
    private readonly params: ContextParams;

    constructor(container: Barrel, params: ContextParams) {
        this.params = params;
        this.container = container;
    }

    formatColorVariable(color: ExtensionColor, options: { defaultColorStringByFormat?: string } = {}): string {
        let defaultColorValue = "";
        if (options && options.defaultColorStringByFormat) {
            defaultColorValue = `${DEFAULT_VALUE_SEPARATOR}${options.defaultColorStringByFormat}`;
        }

        return `var(${PREFIX}${generateVariableName(
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
        const value = d.getValue(
            this.params,
            generateColorNameResolver({
                container: this.container,
                useLinkedStyleguides: this.params.useLinkedStyleguides,
                formatVariableName: (color, options) => this.formatColorVariable(color, options)
            })
        );
        return `${INDENTATION}${d.name}${SEPARATOR}${value}${SUFFIX}`;
    }

    declarationsBlock(declarations: StyleDeclaration[] = []): string {
        return `{\n${declarations.map(this.declaration, this).join("\n")}\n}`;
    }

    variable(name: string, value: StyleValue): string {
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

        return `${PREFIX}${generatedName}${SEPARATOR}${variableValue}${SUFFIX}`;
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

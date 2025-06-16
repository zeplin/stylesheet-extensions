import {
    AtRule,
    Color,
    ContextParams,
    DeclarationOptions,
    generateColorNameResolver,
    generateLinkedColorVariableNameResolver,
    generateVariableName,
    Generator,
    getResourceContainer,
    isDeclarationInherited,
    isHtmlTag,
    Mixin,
    RuleSet,
    RuleSetOptions,
    StyleDeclaration,
    StyleValue
} from "zeplin-extension-style-kit";
import { Barrel, Color as ExtensionColor, Context } from "@zeplin/extension-model";

const PREFIX = "@";
const SEPARATOR = ": ";
const SUFFIX = ";";
const INDENTATION = "  ";

export class LessGenerator implements Generator {
    private readonly container: Barrel;
    private readonly params: ContextParams;
    private readonly declarationOptions: DeclarationOptions;

    constructor(context: Context, params: ContextParams, declarationOptions: DeclarationOptions = {
        namePrefix: PREFIX,
        valueSuffix: SUFFIX,
        nameValueSeparator: SEPARATOR
    }) {
        this.params = params;
        this.container = getResourceContainer(context).container;
        this.declarationOptions = declarationOptions;
    }

    formatColorVariable(color: ExtensionColor): string {
        const { namePrefix } = this.declarationOptions;

        return `${namePrefix}${generateVariableName(color.originalName || color.name!, this.params.variableNameFormat)}`;
    }

    filterDeclarations(childDeclarations: StyleDeclaration[], parentDeclarations: StyleDeclaration[], isMixin?: boolean) {
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
                return !isMixin && showDefaultValues;
            }

            return true;
        });
    }

    declaration(d: StyleDeclaration, mixin?: boolean): string {
        if (d instanceof Mixin) {
            return `${INDENTATION}.${d.identifier.toLowerCase()}()${SUFFIX}`;
        }

        let { params } = this;

        if (mixin) {
            params = Object.assign({}, params, { showDefaultValues: false });
        }

        const value = d.getValue(
            params,
            generateColorNameResolver({
                container: this.container,
                useLinkedStyleguides: this.params.useLinkedStyleguides,
                formatVariableName: color => this.formatColorVariable(color)
            })
        );
        return `${INDENTATION}${d.name}${SEPARATOR}${value}${SUFFIX}`;
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
                formatVariableName: color => this.formatColorVariable(color)
            });
        }

        const variableValue = value.toStyleValue(this.params, colorNameResolver);

        return `${namePrefix}${generatedName}${nameValueSeparator}${variableValue}${valueSuffix}`;
    }

    ruleSet({ selector, declarations }: RuleSet, {
        parentDeclarations = [],
        scope = "",
        mixin = false
    }: RuleSetOptions = {}): string {
        const isMixin = !isHtmlTag(selector) && mixin;
        const filteredDeclarations = this.filterDeclarations(declarations, parentDeclarations, isMixin);

        if (!filteredDeclarations.length) {
            return "";
        }

        let ruleSelector;

        if (isMixin) {
            ruleSelector = `${selector.toLowerCase()}()`;
        } else {
            ruleSelector = scope ? `${scope} ${selector}` : selector;
        }

        return `${ruleSelector} {\n${filteredDeclarations.map(p => this.declaration(p, isMixin)).join("\n")}\n}`;
    }

    atRule({ identifier, declarations }: AtRule): string {
        return `@${identifier} {\n${declarations.map(p => this.declaration(p)).join("\n")}\n}`;
    }
}

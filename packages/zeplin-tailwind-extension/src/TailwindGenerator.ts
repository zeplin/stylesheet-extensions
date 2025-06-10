import { Barrel, Color as ExtensionColor, Context } from "@zeplin/extension-model";
import {
    AtRule,
    Color,
    ColorNameResolver,
    ContextParams,
    DeclarationOptions,
    generateColorNameResolver,
    generateLinkedColorVariableNameResolver,
    generateVariableName,
    Generator,
    getResourceContainer,
    getResources,
    isDeclarationInherited,
    RuleSet,
    RuleSetOptions,
    StyleDeclaration,
    StyleValue,
} from "zeplin-extension-style-kit";
import { TailwindMapper } from "./mapper/TailwindMapper.js";
import { getMinimumSpacingValue } from "./util.js";

const DEFAULT_NAME_PREFIX = "--";
const DEFAULT_SEPARATOR = ": ";
const DEFAULT_VALUE_SUFFIX = ";";
const DEFAULT_WRAPPER_PREFIX = "{\n";
const DEFAULT_WRAPPER_SUFFIX = "\n}";
const INDENTATION = "  ";

export class TailwindGenerator implements Generator {
    private readonly container: Barrel;
    private readonly params: ContextParams;
    private readonly declarationOptions: DeclarationOptions;
    private readonly colorNameResolver: ColorNameResolver;
    private readonly tailwindMapper?: TailwindMapper;

    constructor(context: Context, params: ContextParams, declarationOptions: DeclarationOptions = {
        namePrefix: DEFAULT_NAME_PREFIX,
        valueSuffix: DEFAULT_VALUE_SUFFIX,
        nameValueSeparator: DEFAULT_SEPARATOR,
        wrapperPrefix: DEFAULT_WRAPPER_PREFIX,
        wrapperSuffix: DEFAULT_WRAPPER_SUFFIX,
    }) {
        this.params = params;
        this.container = getResourceContainer(context).container;
        this.declarationOptions = declarationOptions;
        this.colorNameResolver = generateColorNameResolver({
            container: this.container,
            useLinkedStyleguides: this.params.useLinkedStyleguides,
            formatVariableName: color => this.formatColorVariable(color)
        });

        if (declarationOptions.declarationMapper) {
            const spacingSections = getResources({
                context,
                useLinkedStyleguides: params.useLinkedStyleguides,
                resourceFn: barrel => barrel.spacingSections,
            });

            this.tailwindMapper = new declarationOptions.declarationMapper({
                params: this.params,
                colorNameResolver: this.colorNameResolver,
                spacingValue: getMinimumSpacingValue(spacingSections)
            }) as TailwindMapper;
        }
    }

    formatColorVariable(color: ExtensionColor): string {
        return generateVariableName(color.originalName || color.name!, this.params.variableNameFormat).toLowerCase();
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
        const {
            namePrefix,
            nameValueSeparator,
            valueSuffix
        } = this.declarationOptions;


        if (this.tailwindMapper) {
            return this.tailwindMapper.mapValue(d);
        }

        const value = d.getValue(this.params, this.colorNameResolver);

        return `${INDENTATION}${namePrefix}${d.name}${nameValueSeparator}${value}${valueSuffix}`;
    }

    declarationsBlock(declarations: StyleDeclaration[] = []): string {
        const {
            wrapperPrefix,
            wrapperSuffix
        } = this.declarationOptions;

        return `${wrapperPrefix}${declarations.map(this.declaration, this).join(" ")}${wrapperSuffix}`;
    }

    variable(name: string, value: StyleValue): string {
        const {
            namePrefix,
            valueSuffix,
            nameValueSeparator
        } = this.declarationOptions;

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

    ruleSet({ selector, declarations }: RuleSet, { parentDeclarations = [], scope = "" }: RuleSetOptions = {}): string {
        const filteredDeclarations = this.filterDeclarations(declarations, parentDeclarations);
        const ruleSelector = scope ? `${scope} ${selector}` : selector;

        if (!filteredDeclarations.length) {
            return "";
        }

        const declarationsBlock = this.declarationsBlock(filteredDeclarations);
        return this.declarationOptions.useRuleSetName
            ? `${ruleSelector} ${declarationsBlock}`
            : `${declarationsBlock}`;
    }

    atRule({ identifier, declarations }: AtRule): string {
        return `@${identifier} ${this.declarationsBlock(declarations)}`;
    }
}

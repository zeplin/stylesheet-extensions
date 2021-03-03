import Mixin from "zeplin-extension-style-kit/declarations/mixin";
import {
    isHtmlTag,
    isDeclarationInherited,
    generateIdentifier,
    generateColorNameFinder
} from "zeplin-extension-style-kit/utils";

const PREFIX = "$";
const SEPARATOR = ": ";
const SUFFIX = ";";
const INDENTATION = "  ";

class SCSS {
    constructor(container, params) {
        this.params = params;
        this.container = container;
    }

    formatColorVariable(color) {
        return `${PREFIX}${generateIdentifier(color.getFormattedName("kebab"))}`;
    }

    filterDeclarations(childDeclarations, parentDeclarations, isMixin) {
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

    declaration(p, mixin) {
        if (p instanceof Mixin) {
            return `${INDENTATION}@include ${p.identifier}${SUFFIX}`;
        }

        let { params } = this;

        if (mixin) {
            params = Object.assign({}, params, { showDefaultValues: false });
        }

        const value = p.getValue(
            params,
            generateColorNameFinder({
                container: this.container,
                useLinkedStyleguides: this.params.useLinkedStyleguides,
                formatVariableName: this.formatColorVariable
            })
        );
        return `${INDENTATION}${p.name}${SEPARATOR}${value}${SUFFIX}`;
    }

    variable(name, value) {
        return `${PREFIX}${generateIdentifier(name)}${SEPARATOR}${value.toStyleValue(this.params)}${SUFFIX}`;
    }

    ruleSet({ selector, declarations }, { parentDeclarations = [], scope = "", mixin = false } = {}) {
        const isMixin = !isHtmlTag(selector) && mixin;
        const filteredDeclarations = this.filterDeclarations(declarations, parentDeclarations, isMixin);

        if (!filteredDeclarations.length) {
            return "";
        }

        let ruleSelector;

        if (isMixin) {
            ruleSelector = selector.replace(/^\./, "@mixin ");
        } else {
            ruleSelector = scope ? `${scope} ${selector}` : selector;
        }

        return `${ruleSelector} {\n${filteredDeclarations.map(p => this.declaration(p, isMixin)).join("\n")}\n}`;
    }

    atRule({ identifier, declarations }) {
        return `@${identifier} {\n${declarations.map(p => this.declaration(p)).join("\n")}\n}`;
    }
}

export default SCSS;

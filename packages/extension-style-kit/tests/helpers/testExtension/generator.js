import { isPropInherited } from "../../../utils";

const PREFIX = "--";
const MIDFIX = ":";
const SUFFIX = ";";
const INDENTATION = "  ";

class TestGenerator {
    constructor(variables, params) {
        this.variables = variables;
        this.params = params;

        Object.keys(variables).forEach(vName => {
            this.variables[vName] = `var(${PREFIX}${variables[vName]})`;
        });
    }

    filterProps(childProps, parentProps) {
        const { params: { showDefaultValues, showDimensions } } = this;

        return childProps.filter(prop => {
            if (!showDimensions && (prop.name === "width" || prop.name === "height")) {
                return false;
            }

            const parentProp = parentProps.find(p => p.name === prop.name);

            if (parentProp) {
                if (!parentProp.equals(prop)) {
                    return true;
                }

                return !isPropInherited(prop.name);
            }

            if (prop.hasDefaultValue && prop.hasDefaultValue()) {
                return showDefaultValues;
            }

            return true;
        });
    }

    variable(name, value) {
        return `${PREFIX}${name}${MIDFIX} ${value.toStyleValue(this.params)}${SUFFIX}`;
    }

    ruleSet({ selector, props }, { parentProps = [] } = {}) {
        const filteredProps = this.filterProps(props, parentProps);
        return `${selector} {\n${filteredProps.map(p => `${INDENTATION}${p.name}${MIDFIX} ${p.getValue(this.params, this.variables)}${SUFFIX}`).join("\n")}\n}`;
    }
}

export default TestGenerator;
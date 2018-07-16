const PREFIX = "--";
const MIDFIX = ":";
const SUFFIX = ";";
const INDENTATION = "  ";

class CSS {
    constructor(variables, params) {
        this.variables = variables;
        this.params = params;

        Object.keys(variables).forEach(vName => {
            this.variables[vName] = `var(${PREFIX}${variables[vName]})`;
        });
    }

    variable(name, value) {
        return `${PREFIX}${name}${MIDFIX} ${value.toStyleValue(this.params)}${SUFFIX}`;
    }

    ruleSet({ selector, props }, mixin = false) {
        return `${selector}${mixin ? "()" : ""} {\n${props.map(p => `${INDENTATION}${p.name}${MIDFIX} ${p.getValue(this.params, this.variables)}${SUFFIX}`).join("\n")}\n}`;
    }
}

export default CSS;
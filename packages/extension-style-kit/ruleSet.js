class RuleSet {
    constructor(selector, props) {
        this.selector = selector;
        this.propMap = {};

        props.forEach(prop => {
            this.propMap[prop.name] = prop;
        });
    }

    get props() {
        return Object.keys(this.propMap).map(name => this.propMap[name]);
    }

    addProp(prop) {
        this.propMap[prop.name] = prop;
    }

    removeProp(prop) {
        delete this.propMap[prop.name];
    }
}

export default RuleSet;
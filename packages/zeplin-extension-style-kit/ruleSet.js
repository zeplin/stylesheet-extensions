class RuleSet {
    constructor(selector, declarations) {
        this.selector = selector;
        this.declarationMap = {};

        declarations.forEach(declaration => {
            this.declarationMap[declaration.name] = declaration;
        });
    }

    get declarations() {
        return Object.keys(this.declarationMap).map(name => this.declarationMap[name]);
    }

    hasProperty(property) {
        return property in this.declarationMap;
    }

    addDeclaration(declaration) {
        this.declarationMap[declaration.name] = declaration;
    }

    removeDeclaration(declaration) {
        delete this.declarationMap[declaration.name];
    }
}

export default RuleSet;
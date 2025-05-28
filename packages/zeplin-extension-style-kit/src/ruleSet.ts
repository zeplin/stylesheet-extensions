import { StyleDeclaration } from "./common";

export class RuleSet {
    selector: string;
    private declarationMap: Record<string, StyleDeclaration>;

    constructor(selector: string, declarations: StyleDeclaration[] = []) {
        this.selector = selector;
        this.declarationMap = {};

        declarations.forEach(declaration => {
            this.declarationMap[declaration.name] = declaration;
        });
    }

    get declarations(): StyleDeclaration[] {
        return Object.keys(this.declarationMap).map(name => this.declarationMap[name]);
    }

    hasProperty(property: string): boolean {
        return property in this.declarationMap;
    }

    addDeclaration(declaration: StyleDeclaration): void {
        this.declarationMap[declaration.name] = declaration;
    }

    removeDeclaration(declaration: StyleDeclaration): void {
        delete this.declarationMap[declaration.name];
    }
}

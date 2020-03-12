import { StyleDeclaration } from "./common";

declare class RuleSet {
    constructor(selector: string, declarations: Array<StyleDeclaration>);

    selector: string;

    declarations: Array<StyleDeclaration>;

    addDeclaration(declaration: StyleDeclaration): void;

    removeDeclaration(declaration: StyleDeclaration): void;
}

export = RuleSet;
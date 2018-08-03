## RuleSet

It represents property block and the selector identifying it.

### `constructor(selector, declarations)`: `RuleSet`
Creates a `RuleSet` object which is identifed by `selector` and contains `declarations` as style properties.

#### Parameters:
 - `selector`: `string`
 - `declarations`: Array of [`StyleDeclaration`](./declarations.md#styledeclaration).

### `selector`: `string`
Returns selector identifying the ruleset.

### `addDeclaration(declaration)`: `void`
Add `declaration` to the declarations list of ruleset.

#### Parameters:
 - `declaration`: `StyleDeclaration`

### `removeDeclaration(declaration)`: `void`
Remove `declaration` from the declarations list of ruleset.

#### Parameters:
 - `declaration`: `StyleDeclaration`



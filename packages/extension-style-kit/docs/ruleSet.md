## RuleSet

It represents property block and the selector identifying it.

### `constructor(selector, props)`: `RuleSet`
Creates a `RuleSet` object which is identifed by `selector` and contains `props` as style properties.

#### Parameters:
 - `selector`: `string`
 - `props`: Array of [`StyleProp`](./props.md#styleprop).

### `selector`: `string`
Returns selector identifying the ruleset.

### `addProp(prop)`: `void`
Add `prop` to the props list of ruleset.

#### Parameters:
 - `prop`: `StyleProp`

### `removeProp(prop)`: `void`
Remove `prop` from the props list of ruleset.

#### Parameters:
 - `prop`: `StyleProp`



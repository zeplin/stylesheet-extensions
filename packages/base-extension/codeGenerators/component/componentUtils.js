import { selectorize as zeskSelectorize, generateIdentifier } from "zeplin-extension-style-kit/utils";

const PSEUDO_CLASSNAME_MAP = {
    active: "active",
    pressed: "active",
    hover: "hover",
    hovered: "hover",
    focus: "focus",
    focused: "focus",
    enabled: "enabled",
    disabled: "disabled"
};

function selectorize(str, preferPseudoClass = false) {
    const selector = zeskSelectorize(str).toLowerCase();
    if (selector.startsWith(".") && preferPseudoClass) {
        const className = selector.replace(/^\./, "");
        const pseudoClass = PSEUDO_CLASSNAME_MAP[className.toLowerCase()];
        return pseudoClass ? `:${pseudoClass}` : selector;
    }
    return selector;
}

function isStateProperty(propertyName) {
    return generateIdentifier(propertyName.toLowerCase()) === "state";
}

function getBooleanPropertyValue(propertyValue) {
    const valueLowercase = propertyValue.toLowerCase();

    if (!["yes", "no", "true", "false"].includes(valueLowercase)) {
        return null;
    }

    return ["yes", "true"].includes(valueLowercase);
}

function selectorizeComponentProperty(property) {
    const { name, value } = property;
    const booleanValue = getBooleanPropertyValue(value);

    if (booleanValue === false || isDefaultPropertyValue(value)) {
        return "";
    }

    if (booleanValue === true) {
        return selectorize(name, true);
    }

    return selectorize(value, true);
}

function filterComponentsByProperties(components, propertyFilter) {
    return components.filter(component => (
        propertyFilter.every(
            ({ propertyId, targetValue }) => {
                const property = component.findPropertyById(propertyId);

                return property && property.value === targetValue;
            }
        )
    ));
}

function isDefaultPropertyValue(propertyValue) {
    return propertyValue.toLowerCase() === "default";
}

function findDefaultStateComponent(component) {
    const stateProperty = component.properties.find(property => isStateProperty(property.name));

    if (!stateProperty) {
        return;
    }

    if (isDefaultPropertyValue(stateProperty.value)) {
        return component;
    }

    const propertyFilters = getPropertyFiltersForComponent(component).filter(pf => pf.propertyId !== stateProperty.id);

    return filterComponentsByProperties(component.variant.components, propertyFilters).find(c => {
        const property = c.findPropertyByName(stateProperty.name);

        return property && isDefaultPropertyValue(property.value);
    });
}

function getDefaultPropertyFilters(component) {
    const { variant } = component;

    return variant.propertyDescriptors.map(pd => {
        const defaultValue = pd.values.find(value => ["no", "false", "default"].includes(value));

        if (defaultValue) {
            return { propertyId: pd.id, targetValue: defaultValue };
        }

        return null;
    }).filter(Boolean);
}

function fixVariantPropertyOrder(component) {
    const { variant } = component;
    const statePropertyIndex = variant.propertyDescriptors.findIndex(pd => isStateProperty(pd.name));

    if (statePropertyIndex !== -1) {
        const [statePropertyDescriptor] = variant.propertyDescriptors.splice(statePropertyIndex, 1);
        variant.propertyDescriptors.push(statePropertyDescriptor);
    }
}

function getPropertyFiltersForComponent(component) {
    return component.variant.propertyDescriptors.map(pd => ({
        propertyId: pd.id,
        propertyName: pd.name,
        targetValue: component.findPropertyById(pd.id).value
    })).filter(Boolean);
}

export {
    fixVariantPropertyOrder,
    findDefaultStateComponent,
    isStateProperty,
    getPropertyFiltersForComponent,
    filterComponentsByProperties,
    selectorizeComponentProperty,
    getDefaultPropertyFilters
};
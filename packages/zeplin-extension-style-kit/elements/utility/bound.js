import Length from "../../values/length";
import Margin from "../../declarations/margin";
import Padding from "../../declarations/padding";

const useRemUnitForMeasurement = ({ useForMeasurements }) => useForMeasurements;

function getAbsoluteX({ parent, rect: { x } }) {
    if (!parent) {
        return x;
    }
    return getAbsoluteX(parent) + x;
}

function getAbsoluteY({ parent, rect: { y } }) {
    if (!parent) {
        return y;
    }
    return getAbsoluteY(parent) + y;
}

export class Bound {
    constructor(layer) {
        this.xMin = getAbsoluteX(layer);
        this.xMax = this.xMin + layer.rect.width;
        this.yMin = getAbsoluteY(layer);
        this.yMax = this.yMin + layer.rect.height;
        this.children = [];
    }

    static layersToBounds(layers) {
        return layers.reduce(
            (bounds, layer) => {
                if (layer.exportable) {
                    bounds.push(new Bound(layer));
                } else if (layer.type !== "group" || layer.componentName || layer.fills) {
                    bounds.push(new Bound(layer), ...Bound.layersToBounds(layer.layers));
                } else {
                    bounds.push(...Bound.layersToBounds(layer.layers));
                }
                return bounds;
            },
            []
        );
    }

    static layerToBound(layer) {
        const {
            version: {
                layers,
                image: {
                    width,
                    height
                }
            }
        } = layer;

        const duplicatedBounds = Bound.layersToBounds(layers);

        const boundMap = new Map(duplicatedBounds.map(val => [val.key, val]));

        const root = new Bound({
            rect: {
                x: 0,
                y: 0,
                width,
                height
            },
            layers: []
        });

        const bounds = Array.from(boundMap, ([_, bound]) => bound);

        if (!boundMap.get(root.key)) {
            boundMap.set(root.key, root);
        }

        boundMap.forEach(bound => {
            const parent = bound.findParentFromBounds(bounds);
            if (parent) {
                bound.setParent(parent);
            }
        });

        return boundMap.get(new Bound(layer).key);
    }

    findParentFromBounds(bounds) {
        const parentCandidates = bounds.filter(bound => bound.contains(this) && this !== bound);
        const [smallestParent, secondSmallestParent] = parentCandidates.sort((a, b) => a.area - b.area);

        // If there is only one smallest parent
        if (smallestParent && smallestParent.area !== (secondSmallestParent && secondSmallestParent.area)) {
            return smallestParent;
        }
    }

    setParent(parent) {
        this.parent = parent;
        parent.children.push(this);
    }

    contains(current) {
        return (
            this.xMin <= current.xMin &&
            this.xMax >= current.xMax &&
            this.yMin <= current.yMin &&
            this.yMax >= current.yMax
        );
    }

    get area() {
        return (this.xMax - this.xMin) * (this.yMax - this.yMin);
    }

    get key() {
        return `${this.xMin}-${this.xMax}-${this.yMin}-${this.yMax}`;
    }

    get padding() {
        if (this.children.length === 0) {
            return null;
        }
        return new Padding({
            left: new Length(
                Math.min(...this.children.map(({ xMin }) => xMin)) - this.xMin,
                { useRemUnit: useRemUnitForMeasurement }
            ),
            right: new Length(
                this.xMax - Math.max(...this.children.map(({ xMax }) => xMax)),
                { useRemUnit: useRemUnitForMeasurement }
            ),
            top: new Length(
                Math.min(...this.children.map(({ yMin }) => yMin)) - this.yMin,
                { useRemUnit: useRemUnitForMeasurement }
            ),
            bottom: new Length(
                this.yMax - Math.max(...this.children.map(({ yMax }) => yMax)),
                { useRemUnit: useRemUnitForMeasurement }
            )
        });
    }

    get margin() {
        if (!this.parent) {
            return null;
        }
        const parentPadding = this.parent.padding;
        return new Margin(
            {
                left: new Length(
                    this.xMin - Math.max(
                        ...this.parent.children.map(({ xMax }) => xMax).filter(value => value <= this.xMin),
                        this.parent.xMin + parentPadding.left.value
                    ),
                    { useRemUnit: useRemUnitForMeasurement }
                ),
                right: new Length(
                    Math.min(
                        ...this.parent.children.map(({ xMin }) => xMin).filter(value => value >= this.xMax),
                        this.parent.xMax - parentPadding.right.value
                    ) - this.xMax,
                    { useRemUnit: useRemUnitForMeasurement }
                ),
                top: new Length(
                    this.yMin - Math.max(
                        ...this.parent.children.map(({ yMax }) => yMax).filter(value => value < this.yMin),
                        this.parent.yMin + parentPadding.top.value
                    ),
                    { useRemUnit: useRemUnitForMeasurement }
                ),
                bottom: new Length(
                    Math.min(
                        ...this.parent.children.map(({ yMin }) => yMin).filter(value => value >= this.yMax),
                        this.parent.yMax - parentPadding.bottom.value
                    ) - this.yMax,
                    { useRemUnit: useRemUnitForMeasurement }
                )
            });
    }
}

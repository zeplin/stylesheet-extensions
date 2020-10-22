import Length from "../values/length";
import Margin from "../declarations/margin";
import Padding from "../declarations/padding";

const useRemUnitForMeasurement = ({ useForMeasurements }) => useForMeasurements;

export class Bound {
    constructor(layer) {
        this.xMin = Bound.getX(layer);
        this.xMax = this.xMin + layer.rect.width;
        this.yMin = Bound.getY(layer);
        this.yMax = this.yMin + layer.rect.height;
        this.children = [];
    }

    static getX({ parent, rect: { x } }) {
        if (!parent) {
            return x;
        }
        return Bound.getX(parent) + x;
    }

    static getY({ parent, rect: { y } }) {
        if (!parent) {
            return y;
        }
        return Bound.getY(parent) + y;
    }

    static layersToBounds(layers) {
        return layers.reduce(
            (bounds, child) => {
                bounds.push(new Bound(child), ...Bound.layersToBounds(child.layers));
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

        const boundMap = new Map(duplicatedBounds.map(val => [val.getKey(), val]));

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

        if (!boundMap.get(root.getKey())) {
            boundMap.set(root.getKey(), root);
        }

        boundMap.forEach(bound => bound.setParentFromBounds(bounds));

        return boundMap.get(new Bound(layer).getKey());
    }

    setParentFromBounds(bounds) {
        const parentCandidates = bounds.filter(bound => bound.contains(this) && this !== bound);
        const [smallestParent, secondSmallestParent] = parentCandidates.sort((a, b) => a.area - b.area);

        // If there is one smallest parent
        if (smallestParent && smallestParent.area !== (secondSmallestParent && secondSmallestParent.area)) {
            this.parent = smallestParent;
            smallestParent.children.push(this);
        }
    }

    get area() {
        return (this.xMax - this.xMin) * (this.yMax - this.yMin);
    }

    contains(current) {
        return (
            this.xMin <= current.xMin &&
            this.xMax >= current.xMax &&
            this.yMin <= current.yMin &&
            this.yMax >= current.yMax
        );
    }

    getKey() {
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

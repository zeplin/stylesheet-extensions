import Area from "../values/area";
import Margin from "../declarations/margin";
import Padding from "../declarations/padding";

const useRemUnitForMeasurement = ({ useForMeasurements }) => useForMeasurements;

export class BoundTreeNode {
    constructor(layer) {
        this.xMin = BoundTreeNode.getX(layer);
        this.xMax = this.xMin + layer.rect.width;
        this.yMin = BoundTreeNode.getY(layer);
        this.yMax = this.yMin + layer.rect.height;
        this.children = [];
    }

    static getX({ parent, rect: { x } }) {
        if (!parent) {
            return x;
        }
        return BoundTreeNode.getX(parent) + x;
    }

    static getY({ parent, rect: { y } }) {
        if (!parent) {
            return y;
        }
        return BoundTreeNode.getY(parent) + y;
    }

    static layersToBounds(layers) {
        return layers.reduce(
            (bounds, child) => {
                bounds.push(...BoundTreeNode.layersToBounds(child.layers));
                if (child.type !== "group") {
                    bounds.push(new BoundTreeNode(child));
                }
                return bounds;
            },
            []
        );
    }

    static layerToBoundTreeNode(layer) {
        const {
            version: {
                layers,
                image: {
                    width,
                    height
                }
            }
        } = layer;

        const duplicatedBounds = BoundTreeNode.layersToBounds(layers);

        const bounds = new Map(duplicatedBounds.map(val => [val.getKey(), val]));

        const root = new BoundTreeNode({
            rect: {
                x: 0,
                y: 0,
                width,
                height
            },
            layers: []
        });

        if (bounds.get(root.getKey())) {
            bounds.delete(root.getKey());
        }

        bounds.forEach(bound => root.addToTree(bound));

        bounds.set(root.getKey(), root);

        return bounds.get(new BoundTreeNode(layer).getKey());
    }

    addToTree(newBound) {
        if (this.contains(newBound)) {
            const parentCandidates = this.children.filter(item => item.contains(newBound));
            const childCandidates = this.children.filter(item => newBound.contains(item));
            const intersectedSiblings = this.children.filter(item => item.intersects(newBound));

            if (intersectedSiblings.length > childCandidates.length + parentCandidates.length) {
                const intersectedGrandChildren = this.getIntersectedChildren(newBound).filter(
                    item => item.parent !== this
                );
                intersectedGrandChildren.forEach(item => (item.parent = this));
                this.children.push(...intersectedGrandChildren);
            } else if (childCandidates.length > 0) {
                this.children = this.children.filter(item => !newBound.contains(item));
                childCandidates.forEach(item => (item.parent = newBound));
                newBound.children = childCandidates;
            }

            if (parentCandidates.length === 1) {
                parentCandidates[0].addToTree(newBound);
            } else {
                this.children.push(newBound);
                newBound.parent = this;
            }
        }

        return this;
    }

    getIntersectedBounds(current) {
        if (this.intersects(current)) {
            return [
                this,
                ...this.children.reduce(
                    (subResult, item) => {
                        subResult.push(...item.getIntersectedBounds(current));
                        return subResult;
                    },
                    []
                )
            ];
        }
        return [];
    }

    getIntersectedChildren(current) {
        return this.children.reduce(
            (subResult, item) => {
                subResult.push(...item.getIntersectedBounds(current));
                return subResult;
            },
            []
        );
    }

    contains(current) {
        return (
            this.xMin <= current.xMin &&
            this.xMax >= current.xMax &&
            this.yMin <= current.yMin &&
            this.yMax >= current.yMax
        );
    }

    intersects(current) {
        return (
            this.xMin < current.xMax &&
            this.xMax > current.xMin &&
            this.yMin < current.yMax &&
            this.yMax > current.yMin
        );
    }

    getKey() {
        return `${this.xMin}-${this.xMax}-${this.yMin}-${this.yMax}`;
    }

    get padding() {
        if (this.children.length === 0) {
            return null;
        }
        return new Padding(
            new Area(
                {
                    left: Math.min(...this.children.map(({ xMin }) => xMin)) - this.xMin,
                    right: this.xMax - Math.max(...this.children.map(({ xMax }) => xMax)),
                    top: Math.min(...this.children.map(({ yMin }) => yMin)) - this.yMin,
                    bottom: this.yMax - Math.max(...this.children.map(({ yMax }) => yMax))
                },
                { useRemUnit: useRemUnitForMeasurement }
            )
        );
    }

    get margin() {
        if (!this.parent) {
            return null;
        }
        const parentPadding = this.parent.padding;
        return new Margin(
            new Area(
                {
                    left: this.xMin - Math.max(
                        ...this.parent.children.map(({ xMax }) => xMax).filter(value => value <= this.xMin),
                        this.parent.xMin + parentPadding.value.left.value
                    ),
                    right: Math.min(
                        ...this.parent.children.map(({ xMin }) => xMin).filter(value => value >= this.xMax),
                        this.parent.xMax - parentPadding.value.right.value
                    ) - this.xMax,
                    top: this.yMin - Math.max(
                        ...this.parent.children.map(({ yMax }) => yMax).filter(value => value < this.yMin),
                        this.parent.yMin + parentPadding.value.top.value
                    ),
                    bottom: Math.min(
                        ...this.parent.children.map(({ yMin }) => yMin).filter(value => value >= this.yMax),
                        this.parent.yMax - parentPadding.value.bottom.value
                    ) - this.yMax
                },
                { useRemUnit: useRemUnitForMeasurement }
            )
        );
    }
}

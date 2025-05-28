import { Length } from "../../values/length";
import { Margin, Padding } from "../../declarations";
import { Layer as ExtensionLayer } from "@zeplin/extension-model";

interface BoundsOptions {
    useForMeasurements: boolean;
}

type BaseLayer = {
    rect: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    layers: ExtensionLayer[];
    parent?: ExtensionLayer;
};

const useRemUnitForMeasurement = ({ useForMeasurements }: BoundsOptions): boolean => useForMeasurements;

function getAbsoluteX(layer: BaseLayer | ExtensionLayer): number {
    if (!layer.parent) {
        return layer.rect.x;
    }
    return getAbsoluteX(layer.parent) + layer.rect.x;
}

function getAbsoluteY(layer: BaseLayer | ExtensionLayer): number {
    if (!layer.parent) {
        return layer.rect.y;
    }
    return getAbsoluteY(layer.parent) + layer.rect.y;
}

export class Bound {
    xMin: number;
    xMax: number;
    yMin: number;
    yMax: number;
    children: Bound[];
    parent: Bound | null;

    constructor(layer: BaseLayer | ExtensionLayer) {
        this.xMin = getAbsoluteX(layer);
        this.xMax = this.xMin + layer.rect.width;
        this.yMin = getAbsoluteY(layer);
        this.yMax = this.yMin + layer.rect.height;
        this.children = [];
        this.parent = null;
    }

    static layersToBounds(layers: ExtensionLayer[]): Bound[] {
        return layers.reduce(
            (bounds, layer) => {
                if (layer.exportable) {
                    bounds.push(new Bound(layer));
                } else if (layer.type !== "group" || layer.componentName || layer.fills) {
                    bounds.push(new Bound(layer), ...Bound.layersToBounds(layer.layers || []));
                } else {
                    bounds.push(...Bound.layersToBounds(layer.layers || []));
                }
                return bounds;
            },
            [] as Bound[]
        );
    }

    static layerToBound(layer: ExtensionLayer): Bound {
        const layers = layer.version?.layers;
        const width = layer.version?.image?.width || 0;
        const height = layer.version?.image?.width || 0;

        const duplicatedBounds = Bound.layersToBounds(layers || []);

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

        const bounds = Array.from(boundMap, ([, bound]) => bound);

        if (!boundMap.get(root.key)) {
            boundMap.set(root.key, root);
        }

        boundMap.forEach(bound => {
            const parent = bound.findParentFromBounds(bounds);
            if (parent) {
                bound.setParent(parent);
            }
        });

        return boundMap.get(new Bound(layer).key) || root;
    }

    findParentFromBounds(bounds: Bound[]): Bound | null {
        const parentCandidates = bounds.filter(bound => bound.contains(this) && this !== bound);
        const [smallestParent, secondSmallestParent] = parentCandidates.sort((a, b) => a.area - b.area);

        // If there is only one smallest parent
        if (smallestParent && smallestParent.area !== (secondSmallestParent && secondSmallestParent.area)) {
            return smallestParent;
        }

        return null;
    }

    setParent(parent: Bound): void {
        this.parent = parent;
        parent.children.push(this);
    }

    contains(other: Bound): boolean {
        return (
            this.xMin <= other.xMin &&
            this.xMax >= other.xMax &&
            this.yMin <= other.yMin &&
            this.yMax >= other.yMax
        );
    }

    get area(): number {
        return (this.xMax - this.xMin) * (this.yMax - this.yMin);
    }

    get key(): string {
        return `${this.xMin}-${this.xMax}-${this.yMin}-${this.yMax}`;
    }

    get padding(): Padding | null {
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

    get margin(): Margin | null {
        if (!this.parent) {
            return null;
        }
        const parentPadding = this.parent.padding;
        return new Margin(
            {
                left: new Length(
                    this.xMin - Math.max(
                        ...this.parent.children.map(({ xMax }) => xMax).filter(value => value <= this.xMin),
                        this.parent.xMin + (parentPadding?.left.value || 0)
                    ),
                    { useRemUnit: useRemUnitForMeasurement }
                ),
                right: new Length(
                    Math.min(
                        ...this.parent.children.map(({ xMin }) => xMin).filter(value => value >= this.xMax),
                        this.parent.xMax - (parentPadding?.right.value || 0)
                    ) - this.xMax,
                    { useRemUnit: useRemUnitForMeasurement }
                ),
                top: new Length(
                    this.yMin - Math.max(
                        ...this.parent.children.map(({ yMax }) => yMax).filter(value => value < this.yMin),
                        this.parent.yMin + (parentPadding?.top.value || 0)
                    ),
                    { useRemUnit: useRemUnitForMeasurement }
                ),
                bottom: new Length(
                    Math.min(
                        ...this.parent.children.map(({ yMin }) => yMin).filter(value => value >= this.yMax),
                        this.parent.yMax - (parentPadding?.bottom.value || 0)
                    ) - this.yMax,
                    { useRemUnit: useRemUnitForMeasurement }
                )
            });
    }
}

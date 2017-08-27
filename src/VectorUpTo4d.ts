import { ICoordinateUpTo4d } from "./interfaces";

export class VectorUpTo4d implements ICoordinateUpTo4d {
    public x: number;
    public y: number;
    public z: number;
    public w: number;

    /**
     * Vector constructor. Assigns the tuple from either an `ICoordinate` or
     * the spread of the arguments of the form `(x, y, z?, w?)`. Missing values
     * are assigned zero to facilitate faster dot products.
     *
     * @example
     * new Vector({x: 1, y: 2, z: 3, w: 4});
     * @example
     * new Vector(1, 2, 3, 4);
     * @param {ICoordinate | number}      x
     * Either the first value or an `ICoordinate` object (TypeScript doesn't
     * like overloading a `...number[]` with an `ICoordinate`)
     * @param {number[]}       ...others
     * If the first argument is not an `ICoordinate, then the rest of the
     * arguments are the remaining values.
     */
    constructor(x: ICoordinateUpTo4d | number, ...others: number[]) {
        if (typeof x === "object") {
            this.w = x.w /* istanbul ignore next */ || 0;
            this.x = x.x /* istanbul ignore next */ || 0;
            this.y = x.y /* istanbul ignore next */ || 0;
            this.z = x.z /* istanbul ignore next */ || 0;
        } else {
            this.w = others[2] /* istanbul ignore next */ || 0;
            this.x = x;
            this.y = others[0] /* istanbul ignore next */ || 0;
            this.z = others[1] /* istanbul ignore next */ || 0;
        }
    }
}

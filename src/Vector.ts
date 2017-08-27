import {ICoordinate} from "./interfaces";

export class Vector {
    private origin: ICoordinate;


    /**
     * Vector constructor. Assigns the origin from either an `ICoordinate` or
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
    constructor(x: ICoordinate | number, ...others: number[]) {
        if (typeof x === "object") {
            this.origin = {
                w: x.w /* istanbul ignore next */ || 0,
                x: x.x /* istanbul ignore next */ || 0,
                y: x.y /* istanbul ignore next */ || 0,
                z: x.z /* istanbul ignore next */ || 0,
            };
        } else {
            this.origin = {
                w: others[2] /* istanbul ignore next */ || 0,
                x,
                y: others[0] /* istanbul ignore next */ || 0,
                z: others[1] /* istanbul ignore next */ || 0,
            };
        }
    }

}

// Things like ...be.true; or ...be.rejected; dont play nice with TSLint
/* tslint:disable:no-unused-expression */
import * as chai from "chai";
// Needed for describe, it, etc.
import { } from "mocha";
import * as sinon from "sinon";

const expect = chai.expect;
const should = chai.should();
/* tslint:disable-next-line:no-var-requires */
// chai.use(require("chai-as-promised"));

import {ICoordinate} from "../src/interfaces";
import {Vector} from "../src/Vector";

describe("Vector", (): void => {
    let vector: Vector | null;

    const twoDIn: ICoordinate = {x: 4, y: 2};
    const twoDOut: ICoordinate = twoDIn;
    twoDOut.z = 0;
    twoDOut.w = 0;
    const threeDIn: ICoordinate = {x: 4, y: 2, z: 4};
    const threeDOut: ICoordinate = threeDIn;
    threeDOut.w = 0;
    const fourDIn: ICoordinate = {x: 4, y: 2, z: 4, w: 7};
    const fourDOut: ICoordinate = fourDIn;

    describe("constructor", (): void => {
        it("should assign origin from an array", (): any => {
            vector = new Vector(4, 2);
            (vector as any).origin.should.deep.equal(twoDOut);
            vector = new Vector(4, 2, 4);
            (vector as any).origin.should.deep.equal(threeDOut);
            vector = new Vector(4, 2, 4, 7);
            (vector as any).origin.should.deep.equal(fourDOut);
        });

        it("should assign origin from {x, y, z, w} objects", (): any => {
            vector = new Vector(twoDIn);
            (vector as any).origin.should.deep.equal(twoDOut);
            vector = new Vector(threeDIn);
            (vector as any).origin.should.deep.equal(threeDOut);
            vector = new Vector(fourDIn);
            (vector as any).origin.should.deep.equal(fourDOut);
        });
    });
});

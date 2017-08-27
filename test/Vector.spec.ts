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

import {ICoordinateUpTo4d} from "../src/interfaces";
import {VectorUpTo4d} from "../src/VectorUpTo4d";

describe("VectorUpTo4d", (): void => {
    let vector: VectorUpTo4d | null;

    const twoDIn: ICoordinateUpTo4d = {x: 4, y: 2};
    const twoDOut: ICoordinateUpTo4d = twoDIn;
    twoDOut.z = 0;
    twoDOut.w = 0;
    const threeDIn: ICoordinateUpTo4d = {x: 4, y: 2, z: 4};
    const threeDOut: ICoordinateUpTo4d = threeDIn;
    threeDOut.w = 0;
    const fourDIn: ICoordinateUpTo4d = {x: 4, y: 2, z: 4, w: 7};
    const fourDOut: ICoordinateUpTo4d = fourDIn;

    describe("constructor", (): void => {
        it("should assign coordinates from an array", (): any => {
            vector = new VectorUpTo4d(4, 2);
            vector.should.deep.equal(twoDOut);
            vector = new VectorUpTo4d(4, 2, 4);
            vector.should.deep.equal(threeDOut);
            vector = new VectorUpTo4d(4, 2, 4, 7);
            vector.should.deep.equal(fourDOut);
        });

        it("should assign coordinates from {x, y, z, w} objects", (): any => {
            vector = new VectorUpTo4d(twoDIn);
            vector.should.deep.equal(twoDOut);
            vector = new VectorUpTo4d(threeDIn);
            vector.should.deep.equal(threeDOut);
            vector = new VectorUpTo4d(fourDIn);
            vector.should.deep.equal(fourDOut);
        });
    });
});

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

import { ICoordinateUpTo4d } from "../src/interfaces";
import { VectorUpTo4d } from "../src/VectorUpTo4d";

describe("VectorUpTo4d", (): void => {
    let vector: VectorUpTo4d | null;

    const x = Math.random();
    const y = Math.random();
    const z = Math.random();
    const w = Math.random();

    const twoDIn: ICoordinateUpTo4d = { x, y };
    const twoDSumOfParts = x + y;
    const twoDOut: ICoordinateUpTo4d = twoDIn;
    twoDOut.z = 0;
    twoDOut.w = 0;
    const threeDIn: ICoordinateUpTo4d = { x, y, z };
    const threeDSumOfParts = x + y + z;
    const threeDOut: ICoordinateUpTo4d = threeDIn;
    threeDOut.w = 0;
    const fourDIn: ICoordinateUpTo4d = { x, y, z, w };
    const fourDSumOfParts = x + y + z + w;
    const fourDOut: ICoordinateUpTo4d = fourDIn;

    describe("constructor", (): void => {
        it("should assign coordinates from an array", (): any => {
            vector = new VectorUpTo4d(x, y);
            vector.should.deep.equal(twoDOut);
            vector = new VectorUpTo4d(x, y, z);
            vector.should.deep.equal(threeDOut);
            vector = new VectorUpTo4d(x, y, z, w);
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

    describe("dot", (): void => {
        const zeroVector = new VectorUpTo4d(0, 0);
        const onesVector = new VectorUpTo4d(1, 1, 1, 1);
        const twoDVector = new VectorUpTo4d(twoDIn);
        const threeDVector = new VectorUpTo4d(threeDIn);
        const fourDVector = new VectorUpTo4d(fourDIn);

        it("should be commutative", (): any => {
            const randomVector = new VectorUpTo4d(
                Math.random(),
                Math.random(),
                Math.random(),
                Math.random(),
            );
            twoDVector.dot(randomVector).should.deep.equal(randomVector.dot(twoDVector));
            threeDVector.dot(randomVector).should.deep.equal(randomVector.dot(threeDVector));
            fourDVector.dot(randomVector).should.deep.equal(randomVector.dot(fourDVector));
        });

        it("should properly zero out against the zero vector", (): any => {
            zeroVector.dot(twoDVector).should.equal(0);
            zeroVector.dot(threeDVector).should.equal(0);
            zeroVector.dot(fourDVector).should.equal(0);
        });

        it("should drop higher dimensions against lower dimensions", (): any => {
            twoDVector.dot(onesVector).should.equal(twoDSumOfParts);
            threeDVector.dot(onesVector).should.equal(threeDSumOfParts);
            fourDVector.dot(onesVector).should.equal(fourDSumOfParts);
        });
    });
});

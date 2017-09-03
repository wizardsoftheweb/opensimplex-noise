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

import * as Long from "long";

import { PermutationArray } from "../src/PermutationArray";
import { SequenceFromLcg64 } from "../src/SequenceFromLcg64";

describe("PermutationArray", (): void => {
    let permutation: PermutationArray;

    let regenStub: sinon.SinonStub;
    let resetStub: sinon.SinonStub;
    let stepStub: sinon.SinonStub;

    function simpleBefore(): void {
        regenStub = sinon.stub(PermutationArray.prototype as any, "regenerate");
        permutation = new PermutationArray();
        regenStub.reset();
    }

    function assignPrng(): void {
        resetStub = sinon.stub();
        stepStub = sinon.stub();
        (permutation as any).prng = {
            reset: resetStub,
            step: stepStub,
        };
    }

    function simpleAfter(): void {
        permutation = null as any;
        regenStub.restore();
    }

    describe("constructor", (): void => {
        beforeEach(simpleBefore);

        it("should assign the default seed when none is passed in", (): any => {
            permutation = new PermutationArray();
            (permutation as any).prng.seed.should.deep.equal(PermutationArray.DEFAULT_SEED);
        });

        it("should pass off new seeds", (): any => {
            const long47 = Long.fromInt(47);
            permutation = new PermutationArray(long47);
            (permutation as any).prng.seed.should.deep.equal(long47);
        });

        it("should regenerate the permutation indices", (): any => {
            permutation = new PermutationArray();
            regenStub.calledOnce.should.be.true;
        });

        afterEach(simpleAfter);
    });

    describe("regenerate()", (): void => {
        // @todo decide if this implementation-specific test needs to exist
        let prngStub: sinon.SinonStub;
        let indexStub: sinon.SinonStub;
        let permStub: sinon.SinonStub;

        beforeEach((): void => {
            prngStub = sinon.stub(PermutationArray.prototype as any, "initializePrng");
            indexStub = sinon.stub(PermutationArray.prototype as any, "initializePermutationIndices");
            permStub = sinon.stub(PermutationArray.prototype as any, "permuteIndices");
            permutation = new PermutationArray();
            prngStub.reset();
            indexStub.reset();
            permStub.reset();
        });

        it("should call the necessary methods", (): any => {
            permutation.regenerate();
            prngStub.calledOnce.should.be.true;
            indexStub.calledOnce.should.be.true;
            permStub.calledOnce.should.be.true;
        });

        it("should pass through the seed", (): any => {
            permutation.regenerate();
            let call = prngStub.getCall(0);
            call.should.be.an("object").that.has.property("args");
            call.args.should.be.an("array").that.deep.equals([undefined]);
            permutation.regenerate(Long.ZERO);
            call = prngStub.getCall(1);
            call.should.be.an("object").that.has.property("args");
            call.args.should.be.an("array").that.deep.equals([Long.ZERO]);
        });

        afterEach((): void => {
            prngStub.restore();
            indexStub.restore();
            permStub.restore();
        });
    });

    describe("initializePermutationIndices()", (): void => {
        beforeEach(simpleBefore);

        it("should reset the permutation arrays", (): any => {
            const temp = ["qqq"];
            (permutation as any).permutationIndicesPowersOfTwo = temp;
            (permutation as any)
                .permutationIndicesPowersOfTwo
                .should.have.length(temp.length);
            (permutation as any).permutationIndices3d = temp;
            (permutation as any)
                .permutationIndices3d
                .should.have.length(temp.length);
            (permutation as any).initializePermutationIndices();
            (permutation as any)
                .permutationIndicesPowersOfTwo
                .should.have.length(PermutationArray.PERMUTATION_ARRAY_LENGTH);
            (permutation as any)
                .permutationIndices3d
                .should.have.length(PermutationArray.PERMUTATION_ARRAY_LENGTH);
        });

        afterEach(simpleAfter);
    });

    describe("initializePrng()", (): void => {
        beforeEach((): void => {
            simpleBefore();
            assignPrng();
        });

        it("should pass through the seed", (): any => {
            (permutation as any).initializePrng();
            let call = resetStub.getCall(0);
            call.should.be.an("object").that.has.property("args");
            call.args.should.be.an("array").that.deep.equals([undefined]);
            (permutation as any).initializePrng(Long.ZERO);
            call = resetStub.getCall(1);
            call.should.be.an("object").that.has.property("args");
            call.args.should.be.an("array").that.deep.equals([Long.ZERO]);
        });

        it("should step the generator forward", (): any => {
            (permutation as any).initializePrng();
            stepStub.callCount.should.equal(PermutationArray.NUMBER_OF_LCG_INIT_STEPS);
            stepStub.reset();
            (permutation as any).initializePrng(undefined, 0);
            stepStub.called.should.be.false;
            (permutation as any).initializePrng(undefined, 47);
            stepStub.callCount.should.equal(47);
        });

        afterEach(simpleAfter);
    });

    describe("translatePrngModBase()", (): void => {
        const simpleBase = PermutationArray.INDEX_TRANSLATION_CONSTANT * 2;

        beforeEach((): void => {
            simpleBefore();
            assignPrng();
        });

        it("should handle positive returns", (): any => {
            stepStub.returns(Long.ZERO);
            (permutation as any)
                .translatePrngModBase(simpleBase)
                .should.equal(PermutationArray.INDEX_TRANSLATION_CONSTANT);
        });

        it("should handle negative returns", (): any => {
            stepStub.returns(Long.fromInt(0 - PermutationArray.INDEX_TRANSLATION_CONSTANT - 1));
            (permutation as any)
                .translatePrngModBase(simpleBase)
                .should.equal(simpleBase - 1);
        });

        afterEach(simpleAfter);
    });

    describe("translateTo3dValue()", (): void => {
        beforeEach(simpleBefore);

        it("should return the index of a 3D gradient", (): any => {
            for (let index = 0; index < PermutationArray.NUMBER_OF_3D_GRADIENTS; index++) {
                (permutation as any).translateTo3dValue(index).should.equal(index * 3);
            }
        });

        afterEach(simpleAfter);
    });

    describe("permuteIndices()", (): void => {
        beforeEach(simpleBefore);

        it("should permute the index arrays", (): any => {
            const translateStub = sinon.stub(permutation as any, "translatePrngModBase")
                .callsFake((base: number): number => {
                    return base - 1;
                });
            (permutation as any).initializePermutationIndices();
            (permutation as any).permuteIndices();
            (permutation as any)
                .permutationIndicesPowersOfTwo
                .should.deep.equal(PermutationArray.DOMAIN);
            const permArray3d = PermutationArray.DOMAIN.map((value: number) => {
                return (value % PermutationArray.NUMBER_OF_3D_GRADIENTS) * 3;
            });
            (permutation as any)
                .permutationIndices3d
                .should.deep.equal(permArray3d);
        });

        afterEach(simpleAfter);
    });
});

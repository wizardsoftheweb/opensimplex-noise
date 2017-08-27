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

import * as bigInt from "big-integer";

import { LinearCongruentialGenerator64 } from "../src/LinearCongruentialGenerator64";
import { SequenceFromLcg64 } from "../src/SequenceFromLcg64";

describe("SequenceFromLcg64", (): void => {
    let sequence: SequenceFromLcg64;

    describe("constructor", (): void => {
        it("should use the Knuth generator", (): any => {
            sequence = new SequenceFromLcg64(0);
            (sequence as any).generator.should.deep.equal(LinearCongruentialGenerator64.knuthGenerator);
        });

        it("should call reset with the provided seed", (): any => {
            const resetStub = sinon.stub(SequenceFromLcg64.prototype, "reset")
                .returns("some value");
            sequence = new SequenceFromLcg64("qqq");
            resetStub.calledWith("qqq").should.be.true;
            resetStub.restore();
        });
    });

    describe("reset()", (): void => {
        beforeEach((): void => {
            sequence = new SequenceFromLcg64(bigInt.one);
        });

        it("should assign the seed from numbers", (): any => {
            sequence.reset(0);
            sequence.value.should.deep.equal(bigInt.zero);
        });

        it("should assign the seed from strings", (): any => {
            sequence.reset("0");
            sequence.value.should.deep.equal(bigInt.zero);
        });

        it("should assign the seed from BigIntegers", (): any => {
            sequence.reset(bigInt.zero);
            sequence.value.should.deep.equal(bigInt.zero);
        });

        it("should use the original seed if none is passed", (): any => {
            sequence.step(1);
            sequence.value.should.not.deep.equal(bigInt.one);
            sequence.reset();
            sequence.value.should.deep.equal(bigInt.one);
        });

        it("should change the seed when a value is passed in", (): any => {
            sequence.reset(bigInt.zero);
            (sequence as any).seed.should.deep.equal(bigInt.zero);
        });
    });

    describe("get value()", (): void => {
        it("should return the private currentValue", (): any => {
            sequence = new SequenceFromLcg64(0);
            sequence.value.should.deep.equal(bigInt.zero);
        });
    });

    describe("toString()", (): void => {
        it("should return currentValue.toString()", (): any => {
            sequence = new SequenceFromLcg64(47);
            const value = sequence.value;
            sequence.toString().should.equal(value.toString());
        });
    });

    describe("step", (): void => {
        const seed = "12468166129849";
        const output = [
            "2325538385882513620",
            "14552467357210825363",
            "5161056227874468390",
            "5464302309222149117",
            "4694191040976256968",
        ];

        beforeEach((): void => {
            sequence = new SequenceFromLcg64(seed);
        });

        it("should step one place without a value", (): any => {
            sequence.step().toString().should.equal(output[0]);
        });

        it("should throw an error for negative steps", (): any => {
            sequence.step.bind(sequence, -1).should.throw(SequenceFromLcg64.ERROR_NEGATIVE_STEP);
        });

        it("should return the current value for zero steps", (): any => {
            sequence.step(0).toString().should.deep.equal(seed);
        });

        it("should internally call next for a positive count", (): any => {
            sequence.step(output.length).toString().should.equal(output[output.length - 1]);
        });

        it("should update the currentValue with each step", (): any => {
            sequence.value.toString().should.equal(seed);
            for (const value of output) {
                sequence.step().toString().should.equal(value);
            }
        });

        it("should ignore the seed", (): any => {
            (sequence as any).seed.toString().should.equal(seed);
            sequence.value.toString().should.equal(seed);
            sequence.step();
            (sequence as any).seed.toString().should.equal(seed);
            sequence.value.toString().should.equal(output[0]);
        });
    });

    afterEach((): void => {
        sequence = undefined as any;
    });
});

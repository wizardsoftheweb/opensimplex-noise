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

import { LinearCongruentialGenerator64 } from "../src/LinearCongruentialGenerator64";

describe("LinearCongruentialGenerator64", (): void => {
    let generator: LinearCongruentialGenerator64;
    const knuthAddendum = Long.fromString("1442695040888963407");
    const longOne = Long.fromNumber(1);
    const longZero = Long.fromNumber(0);

    describe("knuthGenerator", (): void => {
        it("should assign Knuth's values and return an instance", (): any => {
            const knuthMultiplier = Long.fromString("6364136223846793005");

            generator = LinearCongruentialGenerator64.knuthGenerator;
            (generator as any).multiplier.should.deep.equal(knuthMultiplier);
            (generator as any).addendum.should.deep.equal(knuthAddendum);
        });
    });

    describe("constructor", (): void => {
        it("should assign the constants from integers", (): any => {
            generator = new LinearCongruentialGenerator64(1, 0);
            (generator as any).multiplier.should.deep.equal(longOne);
            (generator as any).addendum.should.deep.equal(longZero);
        });

        it("should assign the constants from strings", (): any => {
            generator = new LinearCongruentialGenerator64("1", "0");
            (generator as any).multiplier.should.deep.equal(longOne);
            (generator as any).addendum.should.deep.equal(longZero);
        });

        it("should assign the constants from Longs", (): any => {
            generator = new LinearCongruentialGenerator64(longOne, longZero);
            (generator as any).multiplier.should.deep.equal(longOne);
            (generator as any).addendum.should.deep.equal(longZero);
        });
    });

    describe("next", (): void => {
        it("should return reasonable values for a small test set", (): void => {
            // Testing a PRNG seems weird. I used Wolfram Alpha to test a few
            // large primes because all I care is that it returns the proper
            // result. The math behind it is beyond the scope of this test.
            generator = LinearCongruentialGenerator64.knuthGenerator;
            generator.next(longZero).should.deep.equal(knuthAddendum);
            generator.next(Long.fromString("12468166129849")).should.deep.equal(Long.fromString("2325538385882513620"));
            generator.next(Long.fromString("7290276569677")).should.deep.equal(Long.fromString("12338510360121572312"));
            generator.next(Long.fromString("15281039276543")).should.deep.equal(Long.fromString("7418825270924538914"));

        });
    });

    afterEach((): void => {
        generator = null as any;
    });
});

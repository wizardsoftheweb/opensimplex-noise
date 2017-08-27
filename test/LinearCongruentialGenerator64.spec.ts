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

describe("LinearCongruentialGenerator64", (): void => {
    let generator: LinearCongruentialGenerator64;
    const knuthAddendum = bigInt("1442695040888963407");

    describe("knuthGenerator", (): void => {
        it("should assign Knuth's values and return an instance", (): any => {
            const knuthMultiplier = bigInt("6364136223846793005");

            generator = LinearCongruentialGenerator64.knuthGenerator;
            (generator as any).multiplier.should.deep.equal(knuthMultiplier);
            (generator as any).addendum.should.deep.equal(knuthAddendum);
        });
    });

    describe("constructor", (): void => {
        it("should assign the constants from integers", (): any => {
            generator = new LinearCongruentialGenerator64(1, 0);
            (generator as any).multiplier.should.deep.equal(bigInt.one);
            (generator as any).addendum.should.deep.equal(bigInt.zero);
        });

        it("should assign the constants from strings", (): any => {
            generator = new LinearCongruentialGenerator64("1", "0");
            (generator as any).multiplier.should.deep.equal(bigInt.one);
            (generator as any).addendum.should.deep.equal(bigInt.zero);
        });

        it("should assign the constants from BigIntegers", (): any => {
            generator = new LinearCongruentialGenerator64(bigInt.one, bigInt.zero);
            (generator as any).multiplier.should.deep.equal(bigInt.one);
            (generator as any).addendum.should.deep.equal(bigInt.zero);
        });
    });

    describe("next", (): void => {
        it("should return reasonable values for a small test set", (): void => {
            // Testing a PRNG seems weird. I used Wolfram Alpha to test a few
            // large primes because all I care is that it returns the proper
            // result. The math behind it is beyond the scope of this test.
            generator = LinearCongruentialGenerator64.knuthGenerator;
            generator.next(bigInt(0)).should.deep.equal(bigInt(knuthAddendum));
            generator.next(bigInt("12468166129849")).should.deep.equal(bigInt("2325538385882513620"));
            generator.next(bigInt("7290276569677")).should.deep.equal(bigInt("12338510360121572312"));
            generator.next(bigInt("15281039276543")).should.deep.equal(bigInt("7418825270924538914"));

        });
    });

    afterEach((): void => {
        generator = null as any;
    });
});

import * as bigInt from "big-integer";

/**
 * Very simple class to wrap a 64-bit
 * [LCG](https://en.wikipedia.org/wiki/Linear_congruential_generator) with
 * convenience methods for common generators.
 *
 * @class LinearCongruentialGenerator64
 * @todo pull out as dependency?
 */
export class LinearCongruentialGenerator64 {
    /** Save 2^64 to reduce computation */
    public static TWO_POW_64: bigInt.BigInteger = (bigInt(2).pow(64));
    /**
     * Returns an LCG using constants from Donald Knuth's MMIX. These constants
     * come directly from
     * [Wikipedia](https://en.wikipedia.org/wiki/Linear_congruential_generator#Parameters_in_common_use)
     * and are attributable to Donald Knuth.
     *
     * @note I'm not actually sure what the license on these numbers is. I've
     * seen them in myriad repos all under completely different licenses, none
     * of which acknowledged the source.
     * @return {LinearCongruentialGenerator64}
     * A generator using the Knuth constants
     */
    public static get knuthGenerator(): LinearCongruentialGenerator64 {
        return new LinearCongruentialGenerator64(
            bigInt("6364136223846793005"),
            bigInt("1442695040888963407"),
        );
    }

    /**
     * Convenience method to access whichever LCG is used by openSimplex.
     *
     * The method is ignored in testing because that would require changing
     * several files to update the generator. As each method is tested, there's
     * no need to ensure (at least for now) that an arbitrary method is called.
     *
     * @note Specific method change if implementation changes.
     * @return {LinearCongruentialGenerator64}
     * A generator using the constants from OpenSimplex
     */
    /* istanbul ignore next */
    public static openSimplexGenerator(): LinearCongruentialGenerator64 {
        return LinearCongruentialGenerator64.knuthGenerator;
    }

    /** @type {bigInt.BigInteger} The generator's multiplier */
    private multiplier: bigInt.BigInteger;
    /** @type {bigInt.BigInteger} The generator's addendum */
    private addendum: bigInt.BigInteger;

    /**
     * Sets the necessary constants for the generator. Can accept `number`s,
     * `string`s, or `BigInteger`s.
     *
     * @param {bigInt.BigNumber} multiplier
     * The multiplier for the generator
     * @param {bigInt.BigNumber} addendum
     * The addendum for the generator
     */
    constructor(multiplier: bigInt.BigNumber, addendum: bigInt.BigNumber) {
        this.multiplier = bigInt(multiplier as any);
        this.addendum = bigInt(addendum as any);
    }

    /**
     * Given a starting value, returns the next value in the sequence:
     * ```
     * next = ((seed * multiplier) + addendum) mod 2^64
     * ```
     *
     * @param  {bigInt.BigNumber}  seed
     * The initial value
     * @return {bigInt.BigInteger}
     * The next value in the sequence
     */
    public next(seed: bigInt.BigNumber): bigInt.BigInteger {
        // I tried to make order of operations more clear.
        return (
            (
                bigInt(seed as any).times(this.multiplier)
            ).plus(this.addendum)
        ).mod(LinearCongruentialGenerator64.TWO_POW_64);
    }
}

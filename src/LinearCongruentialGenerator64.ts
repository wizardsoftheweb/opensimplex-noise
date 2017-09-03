import * as Long from "long";

/**
 * Very simple class to wrap a signed 64-bit
 * [LCG](https://en.wikipedia.org/wiki/Linear_congruential_generator) with
 * convenience methods for common generators.
 *
 * @class LinearCongruentialGenerator64
 * @todo pull out as dependency?
 */
export class LinearCongruentialGenerator64 {
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
            Long.fromString("6364136223846793005"),
            Long.fromString("1442695040888963407"),
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

    /** @type {Long} The generator's multiplier */
    private multiplier: Long;
    /** @type {Long} The generator's addendum */
    private addendum: Long;

    /**
     * Sets the necessary constants for the generator. Can accept `number`s,
     * `string`s, or `Long`s.
     *
     * @param {Long | number | string} multiplier
     * The multiplier for the generator
     * @param {Long | number | string} addendum
     * The addendum for the generator
     */
    constructor(multiplier: Long | number | string, addendum: Long | number | string) {
        this.multiplier = Long.fromValue(multiplier);
        this.addendum = Long.fromValue(addendum);
    }


    /**
     * Given a starting value, returns the next value in the sequence:
     * ```
     * next = ((seed * multiplier) + addendum) mod 2^64
     * ```
     *
     * @param  {Long}  seed
     * The initial value
     * @return {Long}
     * The next value in the sequence
     */
    public next(seed: Long): Long {
        return (seed.multiply(this.multiplier)).add(this.addendum);
    }
}

import * as bigInt from "big-integer";

import { fastFloor } from "./fastFloor";
import { LinearCongruentialGenerator64 } from "./LinearCongruentialGenerator64";

export class SequenceFromLcg64 {
    /** @type {String} Error for passing a negative scope */
    public static ERROR_NEGATIVE_STEP = "Step cannot be negative";
    /**
     * The LCG for the sequence.
     * @type {LinearCongruentialGenerator64}
     * @todo create generator from constructor options
     */
    private generator: LinearCongruentialGenerator64 = LinearCongruentialGenerator64.knuthGenerator;
    /** @type {bigInt.BigInteger} The initial seed for verification purposes */
    private seed: bigInt.BigInteger;
    /** @type {bigInt.BigInteger} Current value of the generator */
    private currentValue: bigInt.BigInteger;

    /**
     * Initializes an LCG sequence using the Knuth generator and `seed` as a
     * `BigInteger` by calling the `reset` method.
     *
     * @see reset
     * @param {bigInt.BigNumber} seed
     * The initial value of the sequence
     */
    constructor(seed: bigInt.BigNumber) {
        this.reset(seed);
    }

    /**
     * Simple getter for `this.currentValue` to prevent write access.
     *
     * @return {bigInt.BigInteger}
     * `this.currentValue`
     */
    public get value(): bigInt.BigInteger {
        return this.currentValue;
    }

    /**
     * Changes `this.seed` and `this.currentValue` to the passed-in value.
     * Defaults to the current value of `this.seed`.
     *
     * @param  {bigInt.BigInteger} seed
     * The seed to use. If none is provided, the method defaults to the current
     * seed value.
     * @return {bigInt.BigInteger}
     * The new current, `seed`, as a `BigInteger`
     */
    public reset(seed?: bigInt.BigNumber): bigInt.BigInteger {
        this.seed = typeof seed === "undefined" ? this.seed : bigInt(seed as any);
        this.currentValue = this.seed;
        return this.value;
    }

    /**
     * Runs the internal generator forward `count` many steps.
     *
     * @param  {number}           count
     * The number of steps. Defaults to one.
     * @return {bigInt.BigInteger}
     * `this.currentValue` after `count`-many `next`s.
     */
    public step(count: number = 1): bigInt.BigInteger {
        if (count === 0) {
            return this.value;
        } else if (count < 0) {
            throw new Error(SequenceFromLcg64.ERROR_NEGATIVE_STEP);
        }
        count = fastFloor(count);
        // Recursion could get nasty here; let's not risk it.
        for (let index = 0; index < count; index++) {
            this.currentValue = this.generator.next(this.currentValue);
        }
        return this.value;
    }

    /**
     * Set the generic `toString` to the string representation of the current
     * value.
     *
     * @return {string}
     * `this.currentValue.toString()`
     */
    public toString(): string {
        return this.value.toString();
    }
}

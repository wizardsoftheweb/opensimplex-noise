import * as Long from "long";

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
    /** @type {Long} The initial seed for verification purposes */
    private seed: Long;
    /** @type {Long} Current value of the generator */
    private currentValue: Long;

    /**
     * Initializes an LCG sequence using the Knuth generator and `seed` as a
     * `Long` by calling the `reset` method.
     *
     * @see reset
     * @param {Long | number | string} seed
     * The initial value of the sequence
     */
    constructor(seed: Long | number | string) {
        this.reset(seed);
    }

    /**
     * Simple getter for `this.currentValue` to prevent write access.
     *
     * @return {Long}
     * `this.currentValue`
     */
    public get value(): Long {
        return this.currentValue;
    }

    /**
     * Changes `this.seed` and `this.currentValue` to the passed-in value.
     * Defaults to the current value of `this.seed`.
     *
     * @param  {Long} seed
     * The seed to use. If none is provided, the method defaults to the current
     * seed value.
     * @return {Long}
     * The new current, `seed`, as a `Long`
     */
    public reset(seed?: Long | number | string): Long {
        this.seed = typeof seed === "undefined" ? this.seed : Long.fromValue(seed);
        this.currentValue = this.seed;
        return this.value;
    }

    /**
     * Runs the internal generator forward `count` many steps.
     *
     * @param  {number}           count
     * The number of steps. Defaults to one.
     * @return {Long}
     * `this.currentValue` after `count`-many `next`s.
     */
    public step(count: number = 1): Long {
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

import * as Long from "long";

import { SequenceFromLcg64 } from "./SequenceFromLcg64";

/**
 * @class PermutationArray
 * @todo hardcode default results for speed (maybe?)
 * @todo hardcode `DOMAIN_REVERSED`
 */
export class PermutationArray {
    public static DEFAULT_SEED = Long.fromNumber(0);
    public static PERMUTATION_ARRAY_LENGTH = 256;
    public static DOMAIN: number[] = new Array(PermutationArray.PERMUTATION_ARRAY_LENGTH)
        .fill(0)
        .map((value: number, index: number) => {
            return index;
        });
    public static DOMAIN_REVERSED: number[] = PermutationArray.DOMAIN.slice().reverse();
    /**
     * This magic number comes directly from
     * [the source](https://gist.github.com/KdotJPG/b1270127455a94ac5d19#file-opensimplexnoise-java-L58)
     * @type {Number}
     */
    public static NUMBER_OF_LCG_INIT_STEPS = 3;
    /**
     * This magic number comes directly from
     * [the source](https://gist.github.com/KdotJPG/b1270127455a94ac5d19#file-opensimplexnoise-java-L63)
     * @type {Number}
     */
    public static INDEX_TRANSLATION_CONSTANT = 31;
    /**
     * This magic number is precalculated from the source
     * ([example](https://gist.github.com/KdotJPG/b1270127455a94ac5d19#file-opensimplexnoise-java-L45))
     * @type {Number}
     * @todo import gradients to calculate length on load
     */
    public static NUMBER_OF_3D_GRADIENTS = 8;
    /**
     * These magic numbers come from the maximum `x` index of the gradient
     * arrays (
     * [2D](https://gist.github.com/KdotJPG/b1270127455a94ac5d19#file-opensimplexnoise-java-L2093)),
     * [3D](https://gist.github.com/KdotJPG/b1270127455a94ac5d19#file-opensimplexnoise-java-L2093),
     * and
     * [4D](https://gist.github.com/KdotJPG/b1270127455a94ac5d19#file-opensimplexnoise-java-L2093)
     * @type {Array}
     * @todo import gradient to calculate on load
     */
    public static INDEX_BITMASKS = [0x0E, 0xFF, 0xFC];
    /** @type {string} Error message for dimension not in 1,2,3 */
    public static UNKNOWN_DIMENSION = "Unrecognized number of dimensions passed in";

    /** @type {SequenceFromLcg64} Internal LCG instance */
    private prng: SequenceFromLcg64;
    /** @type {number[]} Holds the permutation indices for powers of two */
    private permutationIndicesPowersOfTwo: number[];
    /** @type {number[]} Holds the permutation indices for 3D */
    private permutationIndices3d: number[];

    /**
     * Initializes itself with a fresh LCG sequence from `seed` and immediately
     * regenerates the permutation indices.
     *
     * @param {Long = Long | number | string} seed
     * The seed for the LCG. Defaults to `PermutationArray.DEFAULT_SEED`.
     */
    constructor(seed: Long | number | string = PermutationArray.DEFAULT_SEED) {
        this.prng = new SequenceFromLcg64(seed);
        this.regenerate();
    }

    /**
     * Collects and runs all the methods necessary to regenerate the index
     * arrays.
     *
     * @param {Long} seed
     * An optional seed. If not present, the LCG's original seed is used.
     */
    public regenerate(seed?: Long): void {
        this.initializePrng(seed);
        this.initializePermutationIndices();
        this.permuteIndices();
    }

    /**
     * Given `(x, y, z?, w?)`, returns the index of the desired gradient.
     *
     * @param  {number[]} ...coordinates
     * Between two and four (inclusive) numbers, `(x, y, z?, w?)`
     * @return {number}
     * The starting index of the the desired Gradient
     * @todo break into named methods for optimization
     */
    public extrapolate(...coordinates: number[]): number {
        /* tslint:disable:no-bitwise */
        const dimension = coordinates.length;
        const bitMask = PermutationArray.INDEX_BITMASKS[dimension - 2];
        if (bitMask > 0) {
            let result = 0;
            for (let index = 0; index < dimension - 1; index++) {
                /* tslint:disable-next-line:no-bitwise */
                result = this.permutationIndicesPowersOfTwo[(result + coordinates[index]) & 0xFF];
            }
            return (
                dimension === 3
                    ? this.permutationIndices3d
                    : this.permutationIndicesPowersOfTwo
            )[(result + coordinates[dimension - 2]) & 0xFF] & bitMask;
        }
        /* tslint:enable:no-bitwise */
        throw new Error(PermutationArray.UNKNOWN_DIMENSION);
    }

    /**
     * (Re)Initializes the index arrays to empty arrays of length
     * `PermutationArray.PERMUTATION_ARRAY_LENGTH`
     */
    private initializePermutationIndices(): void {
        this.permutationIndicesPowersOfTwo = new Array(PermutationArray.PERMUTATION_ARRAY_LENGTH);
        this.permutationIndices3d = new Array(PermutationArray.PERMUTATION_ARRAY_LENGTH);
    }

    /**
     * Sets up the LCG by reseting it to its seed value, and moves it forward
     * `numberOfInitSteps`. (Original magic number is in
     * `PermutationArray.NUMBER_OF_LCG_INIT_STEPS`)
     *
     * @param {Long   | undefined}                                 seed
     * The new seed to use, if any
     * @param {number} numberOfInitSteps
     * Number of steps to move the LCG forward before beginning. Defaults to
     * `PermutationArray.NUMBER_OF_LCG_INIT_STEPS`.
     */
    private initializePrng(
        seed?: Long | undefined,
        numberOfInitSteps: number = PermutationArray.NUMBER_OF_LCG_INIT_STEPS,
    ): void {
        this.prng.reset(seed);
        for (let i = 0; i < numberOfInitSteps; i++) {
            this.prng.step();
        }
    }

    /**
     * Performs a horizontal translation of the LCG mod `base`, yielding a
     * (pseudo)random number in `[0,base)`
     *
     * @see [Source](https://gist.github.com/KdotJPG/b1270127455a94ac5d19#file-opensimplexnoise-java-L63)
     * @param  {number}    base
     * Number to mod against.
     * @param  {number} horizontalPrngShift
     * Translates the value from the LCG. Defaults to `PermutationArray.INDEX_TRANSLATION_CONSTANT`.
     * @return {number}
     * The resulting random number in `[0,base)`
     */
    private translatePrngModBase(
        base: number,
        horizontalPrngShift: number = PermutationArray.INDEX_TRANSLATION_CONSTANT,
    ): number {
        const pRandom = this.prng.step();
        const result = (pRandom.add(horizontalPrngShift)).mod(base).toInt();
        return result < 0 ? result + base : result;
    }

    /**
     * Returns the appropriate 3D value, skewed to match the 3D gradients
     * @param  {number} value
     * Number to skew
     * @return {number}
     * 3D index
     */
    private translateTo3dValue(value: number): number {
        return (value % PermutationArray.NUMBER_OF_3D_GRADIENTS) * 3;
    }

    /**
     * Rebuilds the permutation arrays using the LCG.
     *
     * A `chosenIndex` in `[0, length)` is picked using the LCG. The chosen
     * value is swapped with the contents at `length - 1`. The process is
     * repeated with `[0, length - n)` until `n = length`.
     * @todo explain the inductive step more better
     */
    private permuteIndices(): void {
        const source = PermutationArray.DOMAIN.slice();
        for (const index of PermutationArray.DOMAIN_REVERSED) {
            const chosenIndex = this.translatePrngModBase(index + 1);
            this.permutationIndicesPowersOfTwo[index] = source[chosenIndex];
            this.permutationIndices3d[index] = this.translateTo3dValue(source[chosenIndex]);
            source[chosenIndex] = source[index];
        }
    }

}

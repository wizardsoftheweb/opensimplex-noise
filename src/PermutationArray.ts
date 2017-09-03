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

    public static UNKNOWN_DIMENSION = "Unknown number of dimensions passed in";



    private prng: SequenceFromLcg64;

    private permutationIndicesPowersOfTwo: number[];
    private permutationIndices3d: number[];

    constructor(seed: Long = PermutationArray.DEFAULT_SEED) {
        this.prng = new SequenceFromLcg64(seed);
        this.regenerate(seed);
    }

    public regenerate(seed?: Long) {
        this.initializePrng();
        this.initializePermutationIndices();
        this.permuteIndices();
    }

    /**
     *
     * @param  {number[]} ...coordinates [description]
     * @return {number}                  [description]
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

    private initializePermutationIndices(): void {
        this.permutationIndicesPowersOfTwo = new Array(PermutationArray.PERMUTATION_ARRAY_LENGTH);
        this.permutationIndices3d = new Array(PermutationArray.PERMUTATION_ARRAY_LENGTH);
    }

    private initializePrng(
        seed: Long = this.prng.seed,
        numberOfInitSteps: number = PermutationArray.NUMBER_OF_LCG_INIT_STEPS,
    ): void {
        this.prng.reset();
        for (let i = 0; i < numberOfInitSteps; i++) {
            this.prng.step();
        }
    }

    private translatePrngModBase(
        base: number,
        horizontalPrngShift: number = PermutationArray.INDEX_TRANSLATION_CONSTANT,
    ): number {
        const pRandom = this.prng.step();
        if (base === 256 || base === 255 || base === 253) {
            console.log(this.prng.value.toString());
            console.log(this.prng.value.toString(2));
        }
        const result = (pRandom.add(horizontalPrngShift)).mod(base).toInt();
        return result < 0 ? result + base : result;
    }

    private translateTo3dValue(value: number): number {
        return (value % PermutationArray.NUMBER_OF_3D_GRADIENTS) * 3;
    }

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

const default3d = [18, 6, 12, 0, 12, 6, 18, 0, 18, 6, 6, 18, 0, 3, 12, 6, 0, 6, 12, 15, 15, 6, 3, 15, 6, 6, 12, 18, 0, 18, 12, 12, 9, 12, 0, 6, 18, 15, 6, 6, 15, 12, 0, 12, 12, 3, 3, 18, 18, 21, 3, 6, 0, 0, 21, 3, 0, 18, 18, 15, 15, 0, 3, 21, 6, 9, 6, 18, 18, 3, 21, 18, 0, 15, 9, 3, 0, 18, 15, 12, 0, 3, 18, 12, 9, 21, 15, 0, 21, 15, 0, 21, 0, 15, 3, 21, 6, 3, 18, 15, 18, 9, 12, 9, 0, 0, 15, 6, 3, 15, 15, 9, 12, 0, 3, 6, 18, 15, 18, 12, 6, 15, 12, 12, 18, 3, 6, 9, 6, 12, 3, 21, 0, 15, 0, 3, 15, 9, 6, 18, 18, 6, 18, 0, 3, 12, 3, 21, 15, 9, 3, 21, 6, 9, 6, 3, 6, 6, 15, 9, 12, 21, 6, 21, 3, 0, 12, 9, 18, 9, 12, 12, 21, 21, 6, 0, 0, 21, 0, 0, 18, 3, 6, 0, 18, 12, 18, 21, 12, 3, 0, 15, 0, 9, 18, 9, 15, 15, 3, 3, 12, 21, 15, 9, 21, 9, 3, 21, 6, 15, 3, 21, 12, 15, 15, 9, 21, 9, 18, 21, 9, 9, 12, 9, 9, 3, 18, 9, 9, 3, 12, 12, 21, 21, 6, 9, 15, 3, 0, 9, 21, 3, 15, 21, 9, 21, 15, 9, 21, 9, 21, 21, 18, 21, 12, 9];
const permutationArray = new PermutationArray();
const resultArray = (permutationArray as any).permutationIndices3d;
for (let index = 255; index >= 253; index--) {
    if (default3d[index] !== resultArray[index]) {
        console.log(`${index}: ${default3d[index]} !== ${resultArray[index]}`);
    }
}

const twoPow64 = "18446744073709551616";
const twoPow64Hex = "0x10000000000000000";
const twoPow64MinusOne = "18446744073709551615";
const twoPow64MinusOneHex = "0xFFFFFFFFFFFFFFFF";
const twoPow63Minus1 = "9223372036854775807";
const twoPow64Minus1Hex = "0x7FFFFFFFFFFFFFFF";

// assert("110011010110110000110101110100101111111001000001001100110110100").equals("110011010110110000110101110100101111111001000001001100110110100");
// 1000111110010100011111110011011011010000110100001111011000000110
// 1010001000000100100110111000001001111101011011011101001011101

/**
 * Provides a fast alternative to `Math.floor`.
 *
 * @see [JS Perf comparison](http://blog.blakesimpson.co.uk/read/58-fastest-alternative-to-math-floor-in-javascript),
 * @see [Method analysis](http://blog.blakesimpson.co.uk/read/58-fastest-alternative-to-math-floor-in-javascript)
 * @param  {number} value
 * A number to floor
 * @return {number}
 * The largest integer that is less than or equal to the input
 */
export function fastFloor(value: number): number {
    /* tslint:disable-next-line:no-bitwise */
    return ~~value;
}

import * as Bluebird from "bluebird";
import * as microtime from "microtime";
import * as path from "path";
import * as shelljs from "shelljs";
import * as winston from "winston";

import { PermutationArray } from "../src/PermutationArray";
import { SequenceFromLcg64 } from "../src/SequenceFromLcg64";

const MAX_RUN_COUNT = 100;
const javaDir = path.join(__dirname, "java");
let exitCode = 0;

const logger = new winston.Logger({
    level: "silly",
    transports: [
        new (winston.transports.Console)({
            colorize: true,
            level: "silly",
            timestamp: true,
        }),
    ],
});

// @todo pull tests into object/function
compileJavaBenchmarks()
    .then(() => {
        logger.info("Beginning benchmarks");
    })
    .then(() => {
        // @todo benchmark not default seed
        logger.info("Benchmarking LCG initialization");
        const lcgResults: IResultSet = newResultSet();
        return benchmarkCallback(() => {
            const lcgSequence = new SequenceFromLcg64(0);
            for (let index = 0; index < PermutationArray.NUMBER_OF_LCG_INIT_STEPS; index++) {
                lcgSequence.step();
            }
        })
            .then((result: IResult) => {
                lcgResults.TypeScript = result;
            })
            .then(() => {
                return benchmarkJava("LcgInitialization")
                    ;
            })
            .then((result: IResult) => {
                lcgResults.Java = result;
            })
            .then(() => {
                pickWinner(lcgResults, "LCG Initialization");
            });
    })
    .then(() => {
        // @todo benchmark not default seed
        logger.info("Benchmarking permutations");
        const lcgResults: IResultSet = newResultSet();
        return benchmarkCallback(() => {
            const permutation = new PermutationArray();
        })
            .then((result: IResult) => {
                lcgResults.TypeScript = result;
            })
            .then(() => {
                return benchmarkJava("FullPermutation")
                    ;
            })
            .then((result: IResult) => {
                lcgResults.Java = result;
            })
            .then(() => {
                pickWinner(lcgResults, "Permutation");
            });
    })
    .then(() => {
        logger.info("Benchmarks finished");
        return cleanUp();
    })
    .catch((error: any) => {
        exitCode = 1;
        logger.error(error);
        logger.error("Benchmarks failed");
    })
    .finally(() => {
        logger[(exitCode === 0 ? "info" : "error")]("Exiting");
        process.exit(exitCode);
    });

interface IResult {
    diff: number;
    start?: [number, number];
    stop?: [number, number];
}

interface IResultSet {
    TypeScript: IResult;
    Java: IResult;
}

function compileJavaBenchmarks() {
    return new Bluebird((resolve, reject) => {
        logger.info("Compiling Java files");
        shelljs.cd(javaDir);
        shelljs.exec(
            `javac *.java`,
            {
                async: true,
                silent: true,
            },
            (code: any, stdout: string, stderr: string) => {
                if (stderr) {
                    return reject(stderr);
                }
                logger.silly(`Compilation output: \n${stdout}`);
                return resolve();
            },
        );
    });
}

// @todo convert to use `Bluebird`s
function benchmarkCallback(callback: any, maxCount = MAX_RUN_COUNT): Bluebird<IResult> {
    logger.verbose("Running TypeScript");
    const start = microtime.nowStruct() as [number, number];
    return Bluebird.each(new Array(maxCount).fill(0), (value: any) => {
        return Bluebird.resolve(callback);
    })
        .then(() => {
            const stop = microtime.nowStruct() as [number, number];
            const diff = (stop[0] - start[0]) * 1e7 + (stop[1] - start[1]);
            logger.silly(`Finished ${maxCount} calls in ${diff} \u03BCs`);
            logger.silly(`Average runtime was ~${diff / 100} \u03BCs`);
            return { diff, start, stop };
        });
}

function benchmarkJava(className: string, maxCount = MAX_RUN_COUNT): Bluebird<IResult> {
    logger.verbose("Running Java");
    return new Bluebird((resolve, reject) => {
        shelljs.cd(javaDir);
        shelljs.exec(
            `java ${className} ${maxCount}`,
            {
                async: true,
                silent: true,
            },
            (code: any, stdout: string, stderr: string) => {
                if (stderr) {
                    return reject(stderr);
                }
                const diff = parseInt(stdout, 10);
                logger.silly(`Finished ${maxCount} calls in ${diff} \u03BCs`);
                logger.silly(`Average runtime was ~${diff / 100} \u03BCs`);
                return resolve({ diff });
            },
        );
    })
        .then((result: IResult) => {
            return result;
        });
}

function newResultSet(): IResultSet {
    const result = {} as any;
    for (const type of ["TypeScript", "Java"]) {
        result[type] = {} as any;
        for (const key of ["start", "stop"]) {
            result[type][key] = null;
        }
    }
    return result;
}

function pickWinner(results: IResultSet, name: string): void {
    const winner = results.TypeScript.diff > results.Java.diff ? "Java" : "TypeScript";
    logger.info(`\
${name} winner: ${winner} @ \
${results[winner].diff} \u03BCs total / \
~${results[winner].diff / 100} \u03BCs average`);
}

function cleanUp(): Bluebird<any> {
    return new Bluebird((resolve, reject) => {
        logger.verbose("Cleaning up compiled Java");
        shelljs.cd(javaDir);
        shelljs.rm("-f", "*.class");
        return resolve();
    });
}

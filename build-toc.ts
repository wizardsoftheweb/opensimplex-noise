// @todo make pre-commit hook
import * as Bluebird from "bluebird";
import * as fs from "fs";
import * as path from "path";
import * as winston from "winston";
/* tslint:disable-next-line:no-var-requires */
const toc = require("markdown-toc");

const readFile = Bluebird.promisify(fs.readFile);
const writeFile = Bluebird.promisify(fs.writeFile);

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

const readmePath = path.join(__dirname, "README.md");
const tocRegExp = /<!-- toc -->\n?([\s\S]*)<!-- tocstop -->/gi;

let exitCode = 0;

(readFile as any)(readmePath, "utf8")
    .then((contents: string) => {
        return contents.replace(tocRegExp, `<!-- toc -->\n${toc(contents).content}\n<!-- tocstop -->`);
    })
    .then((contents: string) => {
        return (writeFile as any)(readmePath, contents, "utf8");
    })
    .catch((error: any) => {
        logger.error(error);
        exitCode = 1;
    })
    .finally(() => {
        process.exit(exitCode);
    });

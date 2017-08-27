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

import { fastFloor } from "../src/fastFloor";

describe("fastFloor", (): void => {
    it("should properly floor numbers", () => {
        for (const integer of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
            fastFloor(integer + Math.random()).should.equal(integer);
            fastFloor(-1 * (integer + Math.random())).should.equal(-1 * integer);
        }
    });
});

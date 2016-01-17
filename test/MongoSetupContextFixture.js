"use strict";

let assert = require('chai').assert;

let MongoSetupContext = require('../lib/MongoSetupContext.js');

describe("MongoSetupContext", () => {
    describe("constructor", () => {
      it("connection_string must be a string", () => {
          assert.throws(() => { new MongoSetupContext({}); });
      });
    })
});
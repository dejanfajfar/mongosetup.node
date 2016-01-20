"use strict";

let assert = require('chai').assert;

let MongoSetupContext = require('../lib/MongoSetupContext.js');

describe("MongoSetupContext", () => {
    describe("constructor", () => {
        it("If connection_string is not a string then an Error is thrown", () => {
            assert.throws(
              () => new MongoSetupContext({}),
              "The mongodb connection string has to be a non empty string");
        });

        it("If connection string is an empty string then an Error is thrown", () => {
            assert.throws(
                () => new MongoSetupContext(""),
                "The mongodb connection string has to be a non empty string"
            );
        });
    })
});
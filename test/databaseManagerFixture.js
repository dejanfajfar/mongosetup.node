"use strict";

var assert = require('chai').assert;
var mongo_setup = require('../lib/databaseManager.js');

describe("databaseManager", () => {
    describe("connectTo", () => {

        it("connectionData must be an object", () => {
            assert.doesNotThrow(() => { mongo_setup.connectTo({}) });
        });

        it("If connectionData is not an Object the an Error is thrown", () => {
            assert.throws(
                () => { mongo_setup.connectTo("") },
                "connectionData must be an object");
        });
    });
});
"use strict";

var assert = require('chai').assert;
var mongo_setup = require('../lib/databaseManager.js');

describe("databaseManager", () => {
    describe("connectTo", () => {

        it("connectionData must be an object", () => {
            assert.doesNotThrow(() => { mongo_setup.connectTo({
                connectionString : "connection_string"
            }) });
        });

        it("Connection data can not be a string", () => {
            assert.throws(
                () => { mongo_setup.connectTo("") },
                "connectionData must be an object");
        });

        it("Connection data can not be a number", () => {
            assert.throws(
                () => { mongo_setup.connectTo(42) },
                "connectionData must be an object");
        });

        it("Connection data can not be undefined", () => {
            assert.throws(
                () => { mongo_setup.connectTo(undefined) },
                "connectTo can not be invoked using undefined");
        });
    });
});
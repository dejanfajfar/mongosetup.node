"use strict";

var assert = require('chai').assert;
var mongo_setup = require('../lib/databaseManager.js');

describe("databaseManager", () => {
    describe("connectTo", () => {

        it("connection string can not be undefined", () => {
            assert.throws(() => {mongo_setup.connectTo(undefined)}, Error);
        });

        it("connection string can be an object", () => {
            assert.throws(() => {mongo_setup.connectTo({})}, Error);
        });

        it("connection string can not be an array", () => {
            assert.throws(() => {mongo_setup.connectTo([])}, Error);
        });

        it("connection string can not be null", () => {
            assert.throws(() => {mongo_setup.connectTo(null)}, Error);
        });

        it("connection string can not be an empty string", () => {
            assert.throws(() => {mongo_setup.connectTo("")}, Error, "mongosetup connection string is empty");
        });

        it("connection string must be a non empty string", () => {
            assert.doesNotThrow(() => {mongo_setup.connectTo("mongo://")})
        });
    });
});
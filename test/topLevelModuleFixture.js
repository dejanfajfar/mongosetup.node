"use strict";

var assert = require('chai').assert;
var mongo_setup = require('../index.js');

describe("Public module", () => {
    describe("forDb", () => {

        it("connection string can not be undefined", () => {
            assert.throws(() => {mongo_setup.forDb(undefined)}, Error);
        });

        it("connection string can be an object", () => {
            assert.throws(() => {mongo_setup.forDb({})}, Error);
        });

        it("connection string can not be an array", () => {
            assert.throws(() => {mongo_setup.forDb([])}, Error);
        });

        it("connection string can not be null", () => {
            assert.throws(() => {mongo_setup.forDb(null)}, Error);
        });

        it("connection string can not be an empty string", () => {
            assert.throws(() => {mongo_setup.forDb("")}, Error, "mongosetup connection string is empty");
        });

        it("connection string must be a non empty string", () => {
            assert.doesNotThrow(() => {mongo_setup.forDb("mongo://")})
        });
    });
});
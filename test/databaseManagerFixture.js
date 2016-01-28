"use strict";

var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

var assert = chai.assert;
var expect = chai.expect;

var sinon = require('sinon');

var mockery = require('mockery');

var mongo_setup;

var validConnectionData = {
    connectionString : "test_connection_string"
};

describe("databaseManager", () => {

    describe("connectTo", () => {

        let connectStub = sinon.stub();

        before(() => {

            mockery.registerAllowables(
                [
                    'path',
                    'mocha',
                    'check-types',
                    'chalk',
                    'escape-string-regexp',
                    'ansi-styles',
                    'strip-ansi',
                    'ansi-regex',
                    'supports-color',
                    '../lib/databaseManager.js',
                    './MongoSetupContext.js',
                    'has-ansi'
                ]);

            mockery.registerMock('mongodb', {
                MongoClient : {
                    connect : connectStub
                    }
            });

            mockery.enable();

            mongo_setup = require('../lib/databaseManager.js');
        });

        after(() => {
            mockery.disable();
        });

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

        it("Starts the promise chain with correct data", () => {
            connectStub.yields(undefined, {});
            let connectToPromise = mongo_setup.connectTo(validConnectionData);

            return expect(connectToPromise).to.eventually.be.fulfilled;

            //mongo_setup.connectTo(validConnectionData).then(context => {
            //    expect(context).to.be.undefined;
            //    expect(context.connectionString).to.be.equal("test_connection_string");
            //    expect(context.db).to.not.be.undefined;
            //});
        });

        it("In case of connection error breaks the promise chain", () => {


            mongo_setup.connectTo(validConnectionData).catch(reason => {
                expect(reason).to.not.be.undefined;
                expect(readon).to.be.an.instanceOf(Error);
                expect(reason.message).to.be.empty;
            });
        });
    });

    describe("handleError", () => {
        it("If only Error given then prints to the error stream", () => {

            Promise.reject(new Error("Test Error")).catch(mongo_setup.handleError());
        })

    });
});
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
    connectionString : "test_connection_string",
    logCallback: (message) => {}
};

describe("databaseManager", () => {

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

        it("Starts the promise chain", () => {
            connectStub.yields(undefined, {});

            let connectToPromise = mongo_setup.connectTo(validConnectionData);

            return expect(connectToPromise).to.eventually.be.fulfilled;
        });

        it("In case of connection error breaks the promise chain", () => {
            connectStub.yields(new Error(), undefined);
            let connectToPromise = mongo_setup.connectTo(validConnectionData);

            return expect(connectToPromise).to.eventually.be.rejected;
        });
    });

    describe("handleError", () => {
        it("If only Error given then prints to the error stream", () => {

            return expect(Promise.reject(new Error("Test"))
                .catch(mongo_setup.handleError()))
                .to.eventually.satisfy(() => true);
        });

        it("If context and error given then DB connection closed", () => {
            let reason = {
                context: {
                    closeConnection: sinon.spy(),
                    log: sinon.spy()
                },
                error: new Error("Test error")
            };

            return expect(Promise.reject(reason)
                .catch(mongo_setup.handleError()))
                .to.eventually.satisfy(() => reason.context.closeConnection.calledOnce);
        });


        it("If context and error given then error logged to console", () => {
            let reason = {
                context: {
                    closeConnection: sinon.spy(),
                    log: sinon.spy()
                },
                error: new Error("Test error")
            };

            return expect(Promise.reject(reason)
                .catch(mongo_setup.handleError()))
                .to.eventually.satisfy(() => reason.context.log.calledOnce);
        });
    });
});
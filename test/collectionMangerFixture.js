"use strict";

var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

var assert = chai.assert;
var expect = chai.expect;
var sinon = require('sinon');
var mockery = require('mockery');

let MongoSetupContext = require('../lib/MongoSetupContext.js');
let cm;
let validContext;

describe("Collection manager", () => {

    let db_collectionStub = sinon.stub();

    before(() => {

        cm = require('./../lib/collectionManager.js');

        validContext = new MongoSetupContext({
            connectionString : "test",
            logCallback: (message) => {},
            db : {
                close : () => {},
                collection : db_collectionStub
            }
        });
    });

    describe("useCollection", () => {
        it("If error thrown then the promise chain is broken", () => {
            db_collectionStub.yields(new Error(), undefined);

            return expect(
                Promise.resolve(validContext)
                .then(cm.useCollection("TestCollection"))
            ).to.eventually.be.rejected;
        });

        it("On success the pomise chain se continued", () => {
            db_collectionStub.yields(undefined, {});

            return expect(
                Promise.resolve(validContext)
                    .then(cm.useCollection("TestCollection"))
            ).to.eventually.be.fulfilled;
        });

        it("On success the collection name is set on the context", () => {
            db_collectionStub.yields(undefined, {});

            return expect(
                Promise.resolve(validContext)
                    .then(cm.useCollection("TestCollection"))
            ).to.eventually.have.property('collectionName', "TestCollection");
        });
    });
});
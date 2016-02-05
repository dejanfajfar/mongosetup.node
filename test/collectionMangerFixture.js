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
let db_collectionStub;
let collection_insertOne_stub;

describe("Collection manager", () => {

    beforeEach(() => {

        cm = require('./../lib/collectionManager.js');

        db_collectionStub = sinon.stub();
        collection_insertOne_stub = sinon.stub();

        validContext = new MongoSetupContext({
            connectionString : "test",
            logCallback: (message) => {},
            db : {
                close : () => {},
                collection : db_collectionStub
            }
        });

        validContext.collection = {
            insertOne: collection_insertOne_stub
        };
    });

    describe("useCollection", () => {
        it("If error thrown then the promise chain is broken", () => {
            db_collectionStub.yields(new Error(), undefined);

            return expect(
                Promise.resolve(validContext)
                .then(cm.useCollection("TestCollection"))
            ).to.eventually.be.rejected;
        });

        it("On success the promise chain is continued", () => {
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

        it("If another collection was already selected then that collection is overridden", () => {
            db_collectionStub.yields(undefined, {});
            let testContext = validContext;
            testContext.db.collectionName = "AnotherCollection";

            return expect(
                Promise.resolve(validContext)
                    .then(cm.useCollection("TestCollection"))
            ).to.eventually.have.property('collectionName', "TestCollection");
        });
    });

    describe("insertOne", () => {
        it("If error thrown then the promise chain is broken", () => {
            collection_insertOne_stub.yields(new Error(), undefined);

            return expect(
                Promise.resolve(validContext)
                    .then(cm.insertOne({}))
            ).to.eventually.be.rejected;
        });

        it("On success the promise chain is continued", () => {
            collection_insertOne_stub.yields(undefined, {});

            return expect(
                Promise.resolve(validContext)
                    .then(cm.insertOne({}))
            ).to.eventually.be.fulfilled;
        });

        it("Expect the collection insertOne method to be called exactly once", () => {
            collection_insertOne_stub.yields(undefined, {});

            return expect(
                Promise.resolve(validContext)
                .then(cm.insertOne({}))
            ).to.eventually.satisfy(() => validContext.collection.insertOne.calledOnce);
        });

        it("The collection insertOnce method is called with the correct document", () => {
            collection_insertOne_stub.yields(undefined, {});
            let document = {
                name: "Test",
                surname: "Test"
            };
            return expect(
                Promise.resolve(validContext)
                    .then(cm.insertOne(document))
            ).to.eventually.satisfy(() => validContext.collection.insertOne.calledWith(document));
        });
    });
});
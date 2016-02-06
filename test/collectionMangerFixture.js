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
let db_collection_stub;
let collection_insertOne_stub;
let collection_insertMany_stub;
let collection_deleteAllDocuments_stub;
let collection_createIndex_stub;

describe("Collection manager", () => {

    beforeEach(() => {

        cm = require('./../lib/collectionManager.js');

        db_collection_stub = sinon.stub();
        collection_insertOne_stub = sinon.stub();
        collection_insertMany_stub = sinon.stub();
        collection_deleteAllDocuments_stub = sinon.stub();
        collection_createIndex_stub = sinon.stub();


        validContext = new MongoSetupContext({
            connectionString : "test",
            logCallback: (message) => {},
            db : {
                close : () => {},
                collection : db_collection_stub
            }
        });

        validContext.collection = {
            insertOne: collection_insertOne_stub,
            insertMany: collection_insertMany_stub,
            deleteMany: collection_deleteAllDocuments_stub,
            createIndex: collection_createIndex_stub
        };
    });

    describe("useCollection", () => {
        it("If error thrown then the promise chain is broken", () => {
            db_collection_stub.yields(new Error(), undefined);

            return expect(
                Promise.resolve(validContext)
                .then(cm.useCollection("TestCollection"))
            ).to.eventually.be.rejected;
        });

        it("On success the promise chain is continued", () => {
            db_collection_stub.yields(undefined, {});

            return expect(
                Promise.resolve(validContext)
                    .then(cm.useCollection("TestCollection"))
            ).to.eventually.be.fulfilled;
        });

        it("On success the collection name is set on the context", () => {
            db_collection_stub.yields(undefined, {});

            return expect(
                Promise.resolve(validContext)
                    .then(cm.useCollection("TestCollection"))
            ).to.eventually.have.property('collectionName', "TestCollection");
        });

        it("If another collection was already selected then that collection is overridden", () => {
            db_collection_stub.yields(undefined, {});
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

    describe("insertMany", () => {
        it("If error thrown then the promise chain is broken", () => {
            collection_insertMany_stub.yields(new Error(), undefined);

            return expect(
                Promise.resolve(validContext)
                    .then(cm.insertMany([]))
            ).to.eventually.be.rejected;
        });

        it("On success the promise chain is continued", () => {
            collection_insertMany_stub.yields(undefined, {});

            return expect(
                Promise.resolve(validContext)
                    .then(cm.insertMany([]))
            ).to.eventually.be.fulfilled;
        });

        it("Expect the collection insertMany method to be called exactly once", () => {
            collection_insertMany_stub.yields(undefined, {});

            return expect(
                Promise.resolve(validContext)
                    .then(cm.insertMany([]))
            ).to.eventually.satisfy(() => validContext.collection.insertMany.calledOnce);
        });

        it("The collection insertMany method is called with the correct document", () => {
            collection_insertMany_stub.yields(undefined, {});
            let document = [{
                name: "Test",
                surname: "Test"
            }];
            return expect(
                Promise.resolve(validContext)
                    .then(cm.insertMany(document))
            ).to.eventually.satisfy(() => validContext.collection.insertMany.calledWith(document));
        });
    });

    describe("deleteAllDocuments", () => {
        it("If error thrown then the promise chain is broken", () => {
            collection_deleteAllDocuments_stub.yields(new Error(), undefined);

            return expect(
                Promise.resolve(validContext)
                    .then(cm.deleteAllDocuments())
            ).to.eventually.be.rejected;
        });

        it("On success the promise chain is continued", () => {
            collection_deleteAllDocuments_stub.yields(undefined, {});

            return expect(
                Promise.resolve(validContext)
                    .then(cm.deleteAllDocuments())
            ).to.eventually.be.fulfilled;
        });

        it("Expect the collection deleteAllDocuments method to be called exactly once", () => {
            collection_deleteAllDocuments_stub.yields(undefined, {});

            return expect(
                Promise.resolve(validContext)
                    .then(cm.deleteAllDocuments())
            ).to.eventually.satisfy(() => validContext.collection.deleteMany.calledOnce);
        });

        it("Expect the collection deleteAllDocuments method to be called with empty filter", () => {
            collection_deleteAllDocuments_stub.yields(undefined, {});

            return expect(
                Promise.resolve(validContext)
                    .then(cm.deleteAllDocuments())
            ).to.eventually.satisfy(() => validContext.collection.deleteMany.calledWith({}));
        });
    });

    describe("createIndex", () => {
        it("If error thrown then the promise chain is broken", () => {
            collection_createIndex_stub.yields(new Error(), undefined);

            return expect(
                Promise.resolve(validContext)
                    .then(cm.createIndex({}, {}))
            ).to.eventually.be.rejected;
        });

        it("On success the promise chain is continued", () => {
            collection_createIndex_stub.yields(undefined, {});

            return expect(
                Promise.resolve(validContext)
                    .then(cm.createIndex({}, {}))
            ).to.eventually.be.fulfilled;
        });

        it("Expect the collection createIndex method to be called exactly once", () => {
            collection_createIndex_stub.yields(undefined, {});

            return expect(
                Promise.resolve(validContext)
                    .then(cm.createIndex({}, {}))
            ).to.eventually.satisfy(() => validContext.collection.createIndex.calledOnce);
        });
    });
});
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
let db_createCollection_stub;
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
        db_createCollection_stub = sinon.stub();

        validContext = new MongoSetupContext({
            connectionString : "test",
            logCallback: (message) => {},
            db : {
                close : () => {},
                collection : db_collection_stub,
                createCollection : db_createCollection_stub
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
        it("Given empty collection name then promise chain is broken", () =>{
            return expect(
                Promise.resolve(validContext)
                    .then(cm.useCollection(""))
            ).to.eventually.be.rejected;
        });

        it("Given undefined collection name then promise chain is broken", () =>{
            return expect(
                Promise.resolve(validContext)
                    .then(cm.useCollection(undefined))
            ).to.eventually.be.rejected;
        });

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

    describe("createCollection", () => {
        it("If error thrown then the promise chain is broken", () => {
            db_createCollection_stub.yields(new Error(), undefined);

            return expect(
                Promise.resolve(validContext)
                    .then(cm.createCollection("TestCollection", {}))
            ).to.eventually.be.rejected;
        });

        it("On success the promise chain is continued", () => {
            db_createCollection_stub.yields(undefined, {});

            return expect(
                Promise.resolve(validContext)
                    .then(cm.createCollection("TestCollection", {}))
            ).to.eventually.be.fulfilled;
        });

        it("On success the collection name is set on the context", () => {
            db_createCollection_stub.yields(undefined, {});

            return expect(
                Promise.resolve(validContext)
                    .then(cm.createCollection("TestCollection", {}))
            ).to.eventually.have.property('collectionName', "TestCollection");
        });

        it("If another collection was already selected then that collection is overridden", () => {
            db_createCollection_stub.yields(undefined, {});
            let testContext = validContext;
            testContext.db.collectionName = "AnotherCollection";

            return expect(
                Promise.resolve(validContext)
                    .then(cm.createCollection("TestCollection", {}))
            ).to.eventually.have.property('collectionName', "TestCollection");
        });

        it("Correct collection initialization options passed to underlying db connection", () => {
            db_createCollection_stub.yields(undefined, {});

            return expect(
                Promise.resolve(validContext)
                    .then(cm.createCollection("TestCollection", {capped : false}))
            ).to.eventually.satisfy(() => db_createCollection_stub.calledWith("TestCollection", {capped : false}));
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

    describe("deleteMatching", () => {
        it("If error thrown then the promise chain is broken", () => {
            collection_deleteAllDocuments_stub.yields(new Error(), undefined);

            return expect(
                Promise.resolve(validContext)
                    .then(cm.deleteMatching({}))
            ).to.eventually.be.rejected;
        });

        it("On success the promise chain is continued", () => {
            collection_deleteAllDocuments_stub.yields(undefined, {});

            return expect(
                Promise.resolve(validContext)
                    .then(cm.deleteMatching({id : 1}))
            ).to.eventually.be.fulfilled;
        });

        it("Expect the collection deleteMany method to be called exactly once", () => {
            collection_deleteAllDocuments_stub.yields(undefined, {});

            return expect(
                Promise.resolve(validContext)
                    .then(cm.deleteMatching({id : 1}))
            ).to.eventually.satisfy(() => validContext.collection.deleteMany.calledOnce);
        });

        it("Expect the collection deleteMany method to be called with provided filter", () => {
            collection_deleteAllDocuments_stub.yields(undefined, {});

            return expect(
                Promise.resolve(validContext)
                    .then(cm.deleteMatching({id : 1}))
            ).to.eventually.satisfy(() => validContext.collection.deleteMany.calledWith({id : 1}));
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
"use strict";

let assert = require('chai').assert;
let expect = require('chai').expect;

let MongoSetupContext = require('../lib/MongoSetupContext.js');

let validContext = new MongoSetupContext({
    connectionString : "test",
    db : {
        close : () => {}
    }
});

describe("MongoSetupContext", () => {
    describe("constructor", () => {
        it("Can not be called with undefined", () => {
            assert.throws(
                () => new MongoSetupContext(undefined),
                "Can not create a new context with undefined"
            );
        });

        it("MongoSetupContext.connectionString must be defined", () => {
            assert.throws(
              () => new MongoSetupContext({}),
              "context data does not contain an connection string");
        });

        it("MongoSetupContext.connectionString can not be an empty string", () => {
            assert.throws(
                () => new MongoSetupContext({
                    connectionString : "",
                    db : {}
                }),
                "The mongodb connection string has to be a non empty string"
            );
        });

        it("MongoSetupContext.db must be defined", () => {
            assert.throws(
                () => new MongoSetupContext({
                    connectionString : "test",
                    db : undefined
                }),
                "The mongodb connection is required"
            );
        });

        it("MongoSetupContext.logCallback not provided then console.log used", () => {
            let tmlConsole = console.log;
            console.log = (message) => {
                expect(message).to.be.equal("test message");
            };

            let context = new MongoSetupContext({
                connectionString : "connection string",
                db : {}
            });

            context.log("test message");

            console.log = tmlConsole;
        });

        it("MongoSetupContext.logCallback not a function then console.log used", () => {
            let tmlConsole = console.log;
            console.log = (message) => {
                expect(message).to.be.equal("test message");
            };

            let context = new MongoSetupContext({
                connectionString : "connection string",
                db : {},
                logCallback : 35
            });

            context.log("test message");

            console.log = tmlConsole;
        });

        it("MongoSetupContext.logCallback is used when provided", () => {
            let myCallback = (message) => {
                expect(message).to.be.equal("test message");
            };

            let context = new MongoSetupContext({
                connectionString : "connection string",
                db : {},
                logCallback : myCallback
            });

            context.log("test message");
        });
    });

    describe("getConnectionString", () => {
        it("Returns the connection string passed to the constructor", () => {
            let context = new MongoSetupContext({
                connectionString : "test connection string",
                db : {}
            });

            expect(context.getConnectionString()).to.be.equal("test connection string");
        });
    });

    describe("closeConnection", () => {
        it("Calls close on the DB object passed in the constructor", () => {
            let context = new MongoSetupContext({
                connectionString : "test",
                db : {
                    close : () => assert.ok(true)
                }
            });

            context.db.close();
        });

        it("Throws error if db.close undefined or not a function", () => {
            let context = new MongoSetupContext({
                connectionString : "test",
                db : {}
            });

            assert.throws(
                () => context.db.close(),
                ""
            );
        });
    });

    describe("log", () => {
        it("Logging callback provided in constructor used", () => {
            let context = new MongoSetupContext({
                connectionString : "test",
                db : {},
                logCallback : (message) => expect(message).to.be.equal("test message")
            });

            context.log("test message");
        });
    });

    describe("createPass", () => {
        it("Given string correctly formatted", () => {
            let formattedMessage = validContext.createPass("test message");

            expect(formattedMessage).to.be.equal("\t\u001b[32m✔\u001b[39m  test message");
        });

        it("Empty string correctly formatted", () => {
            let formattedMessage = validContext.createPass("");

            expect(formattedMessage).to.be.equal("\t\u001b[32m✔\u001b[39m  ");
        });

        it("Undefined correctly formatted", () => {
            let formattedMessage = validContext.createPass(undefined);

            expect(formattedMessage).to.be.equal("\t\u001b[32m✔\u001b[39m  undefined");
        });
    });

    describe("createFail", () => {
        it("Given string correctly formatted", () => {
            let formattedMessage = validContext.createFail("test message");

            expect(formattedMessage).to.be.equal("\t\u001b[31m✘\u001b[39m  test message");
        });

        it("Empty string correctly formatted", () => {
            let formattedMessage = validContext.createFail("");

            expect(formattedMessage).to.be.equal("\t\u001b[31m✘\u001b[39m  ");
        });

        it("Undefined correctly formatted", () => {
            let formattedMessage = validContext.createFail(undefined);

            expect(formattedMessage).to.be.equal("\t\u001b[31m✘\u001b[39m  undefined");
        });
    });

    describe("collection", () => {
        it("Value can not be undefined", () => {
            assert.throws(
                () => validContext.collection = undefined,
                "Database collection must be defined"
            )
        });

        it("Set value is returned", () => {
            validContext.collection = {
                text : "test"
            }

            expect(validContext.collection.text).to.be.equal("test");
        });
    });
});
"use strict";

let check = require('check-types');
let chalk = require('chalk');

let versionManager = require('./versionManager.js');

let useCollection = function(collectionName){
    return (context) => {
        return new Promise((resolve, reject) => {
            Promise.resolve(collectionName)
            .then(() => {
                check.assert.nonEmptyString(collectionName, "The collection name must be provided")
            })
            .then(() => {
                check.assert.not.undefined(collectionName, "The coolection name can not be undefined")
            })
            .then(() => {
                context.db.collection(collectionName, {strict : false}, (err, collection) => {
                    if(err){
                        throw err;
                    }
                    context.collectionName = collectionName;
                    context.collection = collection;
                    context.log(context.createPass(stepName));
                    resolve(context);
                })
            })
            .catch(err => {
                context.log(context.createFail(stepName));
                reject({
                    error : err,
                    context : context
                })
            });

            let stepName = `Using collection ${chalk.bold.underline(collectionName)}`;

        });
    };
};

let createCollection = function(collectionName, options){
    return (context) => {
        return new Promise((resolve, reject) => {
            if(check.emptyString(collectionName) || check.undefined(collectionName)){
                reject({
                    error : new Error("CollecionName can not be an empty string"),
                    context : context
                });
            }

            let stepName = `Created collection ${chalk.bold.underline(collectionName)}`;

            context.db.createCollection(collectionName, options, (err, collection) => {
                if(err){
                    context.log(context.createFail(stepName));
                    reject({
                        error : err,
                        context : context
                    });
                }
                else{
                    context.collectionName = collectionName;
                    context.collection = collection;
                    context.log(context.createPass(stepName));
                    resolve(context);
                }
            });
        });
    };
};

let insertDocument = function(document){
    return (context) => {
        return new Promise((resolve, reject) => {
            let stepName = `Inserting document ${chalk.bold.cyan(JSON.stringify(document))}`;

            context.collection.insertOne(document, {}, (err, doc) => {
                if(err){
                    context.log(context.createFail(stepName));
                    reject(err, context);
                }

                context.log(context.createPass(stepName));
                resolve(context);
            });
        });
    };
};

let insertDocuments = function(documents){
    return (context) => {
        return new Promise((resolve, reject) => {
            let stepName = `Inserting documents ${JSON.stringify(documents)}`;

            context.collection.insertMany(documents, null, (err, r) => {
                if(err){
                    context.log(context.createFail(stepName));
                    reject(err, context);
                }

                context.log(context.createPass(`Inserted ${chalk.bold.underline(r.insertedCount)} documents`));
                resolve(context);
            });
        });
    };
};

let deleteAllDocuments = function(){
    return (context) => {
        return new Promise((resolve, reject) => {
            context.collection.deleteMany({}, null, (err, r) => {
                if(err){
                    context.log(context.createFail("Remove all documents"));
                    reject(err, context);
                }

                context.log(context.createPass(`Removed ${chalk.bold.underline(r.deletedCount)} documents`));
                resolve(context);
            });
        });
    };
};

let deleteIfMatching = function(whereClaus){
    return (context) => {
        return new Promise((resolve, reject) => {
            context.collection.deleteMany(whereClaus, null, (err, r) => {
                if(err){
                    context.log(context.createFail("Remove if matching"));
                    reject(err, context);
                }

                context.log(context.createPass(`Removed ${chalk.bold.underline(r.deletedCount)} documents`));
                resolve(context);
            });
        });
    };
};

let createIndex = function(field, options){
    return (context) => {
        return new Promise((resolve, reject) => {
            context.collection.createIndex(field, options, (err, result) => {
                if(err){
                    context.log(context.createFail("Create index failed"));
                    reject(err, context);
                }
                context.log(context.createPass(`Created index ${options.name} on collection ${context.collectionName}`));
                resolve(context);
            });
        });
    };
};

let closeConnection = function(){
    return (context) => {
        return new Promise((resolve, reject) => {
            context.closeConnection();
            context.log(`Closed connection to ${chalk.yellow.bold(context.connection_string)}`);
            resolve(context);
        });
    }
};


module.exports = {
    useCollection : useCollection,
    createCollection : createCollection,
    deleteAllDocuments : deleteAllDocuments,
    deleteMatching: deleteIfMatching,
    disconnect : closeConnection,
    createIndex : createIndex,
    insertOne : insertDocument,
    insertMany : insertDocuments,
    updateVersion : versionManager.writeVersion,
    requireVersion : versionManager.checkVersion
};
"use strict";

let check = require('check-types');
let chalk = require('chalk');

let versionManager = require('./versionManager.js');

let useCollection = function(collectionName){
    return (context) => {
        return new Promise((resolve, reject) => {
            Promise.resolve()
            .then(() => {
                check.assert.nonEmptyString(collectionName, "The collection name must be provided")
            })
            .then(() => {
                check.assert.not.undefined(collectionName, "The collection name can not be undefined")
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
            Promise.resolve()
            .then(() => {
                check.assert.nonEmptyString(collectionName, "The collection name must be provided")
            })
            .then(() => {
                check.assert.not.undefined(collectionName, "The collection name can not be undefined")
            })
            .then(() => {
                check.assert.not.undefined(options, "The collection options can not be undefined")
            })
            .then(() => {
                check.assert.object(options, "The collection options can not be undefined")
            })
            .then(() => {
                context.db.createCollection(collectionName, options, (err, collection) => {
                    if(err){
                        throw err;
                    }
                    else{
                        context.collectionName = collectionName;
                        context.collection = collection;
                        context.log(context.createPass(stepName));
                        resolve(context);
                    }
                });
            })
            .catch(err => {
                context.log(context.createFail(stepName));
                reject({
                    error : err,
                    context : context
                })
            });

            let stepName = `Created collection ${chalk.bold.underline(collectionName)}`;
        });
    };
};

let insertDocument = function(document){
    return (context) => {
        return new Promise((resolve, reject) => {
            Promise.resolve()
            .then(() => {
                check.assert.not.undefined(document, "The document to insert can not be undefined")
            })
            .then(() => {
                context.collection.insertOne(document, {}, (err, doc) => {
                    if(err){
                        throw err;
                    }

                    context.log(context.createPass(stepName));
                    resolve(context);
                })
            })
            .catch(err => {
                context.log(context.createFail(stepName));
                reject(err, context);
            });

            let stepName = `Inserting document ${chalk.bold.cyan(JSON.stringify(document))}`;
        });
    };
};

let insertDocuments = function(documents){
    return (context) => {
        return new Promise((resolve, reject) => {
            Promise.resolve()
            .then(() => {
                check.assert.not.undefined(documents, "The documents to insert can not be undefined")
            })
            .then(() => {
                check.assert.array(documents, "The documents must be an array")
            })
            .then(() => {
                context.collection.insertMany(documents, null, (err, r) => {
                    if(err){
                        throw err;
                    }

                    context.log(context.createPass(`Inserted ${chalk.bold.underline(r.insertedCount)} documents`));
                    resolve(context);
                })
            })
            .catch(err => {
                context.log(context.createFail(stepName));
                reject(err, context);
            });

            let stepName = `Inserting documents ${JSON.stringify(documents)}`;
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
            Promise.resolve()
            .then(() => {
                check.assert.not.undefined(whereClaus, "The where claus can not be undefined");
            })
            .then(() => {
                check.assert.object(whereClaus, "The where clause is expected to be an object");
            })
            .then(() => {
                context.collection.deleteMany(whereClaus, null, (err, r) => {
                    if(err){
                        throw err;
                    }

                    context.log(context.createPass(`Removed ${chalk.bold.underline(r.deletedCount)} documents`));
                    resolve(context);
                })
            })
            .catch(err => {
                context.log(context.createFail("Remove if matching"));
                reject(err, context);
            });
        });
    };
};

let createIndex = function(field, options){
    return (context) => {
        return new Promise((resolve, reject) => {
            Promise.resolve()
            .then(() => {
                check.assert.not.undefined(field, "The properties affected by the index can not be undefined");
            })
            .then(() => {
                check.assert.object(field, "The affected properties must be provided as a object");
            })
            .then(() => {
                check.assert.not.undefined(options, "The index options can not be undefined");
            })
            .then(() => {
                check.assert.object(options, "The index options hav to be provided as a object");
            })
            .then(() => {
                context.collection.createIndex(field, options, (err, result) => {
                    if(err){
                        throw err;
                    }
                    context.log(context.createPass(`Created index ${options.name} on collection ${context.collectionName}`));
                    resolve(context);
                })
            })
            .catch(err => {
                context.log(context.createFail("Create index failed"));
                reject(err, context);
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
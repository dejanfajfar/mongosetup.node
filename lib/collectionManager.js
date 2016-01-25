"use strict";

let check = require('check-types');
let chalk = require('chalk');

let versionCollectionName = "version";

let useCollection = function(collectionName){
    return (context) => {
        return new Promise((resolve, reject) => {
            let stepName = `Using collection ${chalk.bold.underline(collectionName)}`;

            context.db.collection(collectionName, {strict : false}, (err, collection) => {
                if(err){
                    context.log(context.createFail(stepName));
                    reject({
                        error : err,
                        context : context
                    });
                }
                context.collectionName = collectionName;
                context.collection = collection;
                context.log(context.createPass(stepName));
                resolve(context);
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

let writeVersion = function(version){
    return (context) => {
        return new Promise((resolve, reject) => {
            context.db.collection(versionCollectionName,
                {strict : false},
                (err, collection) => {
                    if(err){
                        context.log(context.createFail("Inserting version"));
                        reject(err, context);
                    }

                    let newVersion = {
                        version : version,
                        timestamp : new Date()
                    };

                    collection.insertOne(newVersion, null, (err, r) => {
                        if(err){
                            context.log(context.createFail("Inserting version"));
                            reject(err, context);
                        }
                        context.log(context.createPass(`Updated to ${chalk.bold.blue(version)}`));
                        resolve(context);
                    });
                });
        });
    }
};

let checkVersion = function(version){
    return (context) => {
        return new Promise((resolve, reject) => {
            let stepName = `Require version ${chalk.bold.blue(version)}`;
            context.db.collection(versionCollectionName,
                {strict : false},
                (err, collection) => {
                    if(err){
                        context.log(context.createFail(stepName));
                        reject(err, context);
                    }

                    collection.count({ version : version})
                        .then(count => {
                            if(count === 0){
                                context.log(context.createFail(stepName));
                                let err = new Error(`Version ${version} not found`);
                                reject({
                                    error : err,
                                    context : context
                                });
                            }
                            else{
                                context.log(context.createPass(stepName));
                                resolve(context);
                            }
                        }).catch(err => {
                            context.log(context.createFail(stepName));
                            reject(err, context);
                    });
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
    deleteAllDocuments : deleteAllDocuments,
    disconnect : closeConnection,
    createIndex : createIndex,
    insertOne : insertDocument,
    insertMany : insertDocuments,
    updateVersion : writeVersion,
    requireVersion : checkVersion
};
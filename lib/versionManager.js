"use strict";

let check = require('check-types');
let chalk = require('chalk');

let versionCollectionName = "version";

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

module.exports = {
    checkVersion : checkVersion,
    writeVersion: writeVersion
};
"use strict";

let check = require('check-types');
let chalk = require('chalk');
let MongoClient = require('mongodb').MongoClient;

let MongoSetupContext = require('./MongoSetupContext.js');

module.exports.connectTo = function(connectionData){
    check.assert.not.undefined(connectionData, "connectTo can not be invoked using undefined");
    check.assert.object(connectionData, "connectionData must be an object");
    check.assert.not.string(connectionData, "connectionData must be an object");
    check.assert.string(connectionData.connectionString, "The connection string must be a string");

    if(check.not.undefined(connectionData.logCallback)){
        check.assert.function(connectionData.logCallback);
    }
    else{
        connectionData.logCallback = (message) => console.log(message)
    }

    
    return new Promise((resolve, reject) => {

        MongoClient.connect(connectionData.connectionString, (err, db) => {
            if(err){
                reject(err);
            }

            let context = new MongoSetupContext({
                connectionString : connectionData.connectionString,
                db : db,
                logCallback : connectionData.logCallback
            });
            context.log(`Connected to ${chalk.yellow.bold(context.getConnectionString())}`);
            resolve(context);
        });
    });
};

module.exports.handleError = function(){
    return reason => {
        if(check.instance(reason, Error)){
            console.error(chalk.red(reason.stack));
            return;
        }

        let context = reason.context;
        let error = reason.error;

        context.closeConnection();
        context.log(chalk.red(error.stack));
    };
};
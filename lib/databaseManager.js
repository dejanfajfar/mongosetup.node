"use strict";

let check = require('check-types');
let chalk = require('chalk');

let MongoSetupContext = require('./MongoSetupContext.js');

module.exports.connectTo = function(connectionData){
    check.assert.not.undefined(connectionData, "connectTo can not be invoked using undefined");
    check.assert.object(connectionData, "connectionData must be an object");

    return new Promise((resolve, reject) => {
        let context = new MongoSetupContext(connection_string);
        context.log(`Connecting to ${chalk.yellow.bold(connection_string)}`);
        resolve(context);
    });
};

module.exports.handleError = function(){
    return (err) => {
        console.error(chalk.red(err.message));
    };
};
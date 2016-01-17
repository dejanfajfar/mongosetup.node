"use strict";

let check = require('check-types');

let MongoSetupContext = require('./MongoSetupContext.js');

module.exports.connectTo = function(connection_string){
    check.assert.not.undefined(connection_string, "mongosetup initialized with undefined connection string");
    check.assert.string(connection_string, "mongosetup connection string must be a string");
    check.assert.not.emptyString(connection_string, "mongosetup connection string is empty");

    return new Promise((resolve, reject) => {
        console.log(`Connecting to ${chalk.yellow.bold(connection_string)}`);
        let context = new MongoSetupContext(connection_string);
        resolve(context);
    });
};
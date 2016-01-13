"use strict";

let check = require('check-types');

module.exports.forDb = function(connection_string){
    if(check.undefined(connection_string)){
        throw new Error("mongosetup initialized with undefined connection string");
    }
    if(!check.string(connection_string)){
        throw new Error("mongosetup connection string must be a string");
    }
    if(check.emptyString(connection_string)){
        throw new Error("mongosetup connection string is empty");
    }
};
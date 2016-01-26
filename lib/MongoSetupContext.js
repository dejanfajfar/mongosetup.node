"use strict";

let check = require('check-types');
let chalk = require('chalk');

class MongoSetupContext{
    constructor(contextData){
        check.assert.not.undefined(contextData, "Can not create a new context with undefined");
        check.assert.not.undefined(contextData.connectionString, "context data does not contain an connection string"),
        check.assert.not.emptyString(contextData.connectionString, "The mongodb connection string has to be a non empty string");
        check.assert.not.undefined(contextData.db, "The mongodb connection is required");

        this.connection_string = contextData.connectionString;
        this.db = contextData.db;

        if(check.not.undefined(contextData.logCallback) && check.function(contextData.logCallback)){
            this.logging_function = contextData.logCallback;
        }
        else{
            this.logging_function = (message) => console.log(message);
        }
    }

    getConnectionString() {
        return this.connection_string;
    }

    closeConnection(){
        if(check.undefined(this.db.close) || check.not.function(this.db.close)){
            throw new Error("Database connection object does not have a close method");
        }
        this.db.close();
    }

    log(message){
        this.logging_function(message);
    }

    createPass(message){
        let check = String.fromCharCode(10004);
        return `\t${chalk.green(check)}  ${message}`;
    }

    createFail(message){
        let x = String.fromCharCode(10008);
        return `\t${chalk.red(x)}  ${message}`;
    }


    get collection(){
        return this.collection_reference;
    }

    set collection(val){
        check.assert.not.undefined(val, "Database collection must be defined");

        this.collection_reference = val;
    }
}

module.exports = MongoSetupContext;
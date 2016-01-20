"use strict";

let check = require('check-types');
let chalk = require('chalk');

class MongoSetupContext{
    constructor(contextData){
        check.assert.not.undefined(contextData, "Can not create a new context with undefined");
        check.assert.string(contextData.connectionString, "The mongodb connection string has to be a non empty string");
        check.assert.not.emptyString(contextData.connectionString, "The mongodb connection string has to be a non empty string");
        check.assert.not.undefined(contextData.db, "The mongodb connection is required");

        this.connection_string = contextData.connectionString;
        this.db = contextData.db;
        this.logging_function = (message) => console.log(message);
    }

    getDb(){
        return this.db;
    }

    getConnectionString() {
        return this.connection_string;
    }

    closeConnection(){
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


    get collectionName(){
        return this.collection_name;
    }

    set collectionName(val){
        this.collection_name = val;
    }

    get collection(){
        return this.collection_reference;
    }

    set collection(val){
        this.collection_reference = val;
    }
}

module.exports = MongoSetupContext;
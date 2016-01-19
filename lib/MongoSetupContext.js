"use strict";

let check = require('check-types');

class MongoSetupContext{
    constructor(connection_string){
        check.assert.string(connection_string, "The mongodb connection string has to be a string");
        check.assert.not.emptyString(connection_string, "The mongodb connection string can not be empty");
        this.connection_string = connection_string;
        this.logging_function = (message) => console.log(message);
    }

    get connection(){

    }

    get connection_string() {
        return this.connection_string;
    }


    set connection_string(connection_string){

        this.connection_string = connection_string;
    }

    invert(){
        this.executeNextStep = false;
        return this;
    }

    log(message){
        this.logging_function(message);
    }


    get collection_name(){
        return this.collection_name;
    }

    set collection_name(collection_name){
        this.collection_name = collection_name;
    }
}

module.exports = MongoSetupContext;
"use strict";

let check = require('check-types');

class MongoSetupContext{
    constructor(connection_string){
        check.assert.string(connection_string, "The mongodb connection string has to be a string");
        this.connection_string = connection_string;
    }

    get mongodb_connection(){

    }

    get_connection_string(){
        return this.connection_string;
    }

    invert(){
        this.executeNextStep = false;
        return this;
    }


    get collection_name(){
        return this.collection_name;
    }

    set collection_name(collection_name){
        this.collection_name = collection_name;
    }
}

module.exports = MongoSetupContext;
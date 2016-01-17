"use strict";

class MongoSetupContext{
    constructor(connection_string){
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
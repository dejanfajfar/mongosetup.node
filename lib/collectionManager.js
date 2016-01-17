"use strict";

let check = require('check-types');
let chalk = require('chalk');

let useCollection = function(collection_name){
    return (context) => {
        return new Promise((resolve, reject) => {
            console.log(`Using collection ${chalk.bold.underline(collection_name)}`);
            resolve(context);
        });
    };
};

let deleteAllDocuments = function(){
    return (context) => {
        return new Promise((resolve, reject) => {
            console.log("Removing all documents");
            resolve(context);
        });
    };
};

let closeConnection = function(){
    return (context) => {
        return new Promise((resolve, reject) => {
            console.log(`Closing connection to ${chalk.yellow.bold(context.connection_string)}`)
        });
    }
};


module.exports = {
    useCollection : useCollection,
    deleteAllDocuments : deleteAllDocuments,
    disconnect : closeConnection
};
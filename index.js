"use strict";

let collectionManager = require('./lib/collectionManager.js');
let databaseManager = require('./lib/databaseManager.js');

module.exports.connectTo = databaseManager.connectTo;
module.exports.collectionPromises = collectionManager;
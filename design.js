/*
var mongoSetup = require('mongosetup');

var mongo_setup = mongoSetup.forDb("mongo://localhost:27017/demo");

mongo_setup.start(
    mongo_setup.ifExistsCollection("LogEntries")
        .then(mongo_setup.dropCollection("LogEntries"))
        .then(mongo_setup.createCollection("LogEntries"))
        .then(mongo_setup.fillData("LogEntries", [1, 2, 3])),
    mongo_setup.ifNotExistsCollection("AuditTrail")
        .then(mongo_setup.createCollection("AuditTrail"))
).done()
.onError(err => {});

*/

var mongoSetup = require('./index.js');
var cp = mongoSetup.collectionPromises;

mongoSetup.connectTo("mongo://localhost:27017/demo")
    .then(cp.useCollection("MyCollection"))
    .then(cp.deleteAllDocuments())
    .then(cp.disconnect())
    .catch(mongoSetup.handleError());



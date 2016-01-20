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

var connectionData = {
    connectionString : "mongodb://localhost:27017/demo"
};
mongoSetup.connectTo(connectionData)
    .then(cp.requireVersion("1.0.0-cp1"))
    .then(cp.useCollection("MyCollection"))
    .then(cp.deleteAllDocuments())
    .then(cp.insertOne({name : "Domonique Branson"}))
    .then(cp.insertMany([{name : "Wonda	Babcock"}, {name : "Ambrose	Tyree"}, {name : "Daysi	Oden"}]))
    .then(cp.createIndex({name : 1}, {name : "name_index"}))
    .then(cp.updateVersion("1.0.0-cp2"))
    .then(cp.disconnect())
    .catch(mongoSetup.handleError());



var mongoSetup = require('./../index.js');
var cp = mongoSetup.collectionPromises;

var connectionData = {
    connectionString : "mongodb://localhost:27017/demo"
};


mongoSetup.connectTo(connectionData)
    .then(cp.requireVersion("1.0.0-cp1"))
    .then(cp.useCollection("MyCollection"))
    .then(cp.deleteAllDocuments())
    .then(cp.insertMany([{name : "Wonda	Babcock"}, {name : "Ambrose	Tyree"}, {name : "Daysi	Oden"}]))
    .then(cp.createIndex({name : 1}, {name : "name_index"}))
    .then(cp.dropCollection("MyCollection"))
    .then(cp.updateVersion("1.0.0-cp2"))
    .then(cp.disconnect())
    .catch(mongoSetup.handleError());
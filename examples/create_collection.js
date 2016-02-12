var mongoSetup = require('./../index.js');
var cp = mongoSetup.collectionPromises;

var connectionData = {
    connectionString : "mongodb://localhost:27017/create_collection"
};

mongoSetup.connectTo(connectionData)
    .then(cp.useCollection("MyCollection"))
    .then(cp.disconnect())
    .catch(mongoSetup.handleError());
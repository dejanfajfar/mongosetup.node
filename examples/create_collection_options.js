var mongoSetup = require('./../index.js');
var cp = mongoSetup.collectionPromises;

var connectionData = {
    connectionString : "mongodb://localhost:27017/create_collection_options"
};

mongoSetup.connectTo(connectionData)
    .then(cp.createCollection("MyCollection", {capped: true, max: 50, size: 10000}))
    .then(cp.disconnect())
    .catch(mongoSetup.handleError());
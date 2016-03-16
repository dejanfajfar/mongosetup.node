var mongoSetup = require('./../index.js');
var cp = mongoSetup.collectionPromises;

var connectionData = {
    connectionString : "mongodb://localhost:27017/drop_collection"
};

mongoSetup.connectTo(connectionData)
    .then(cp.dropIndex("my_collection"))
    .then(cp.disconnect())
    .catch(mongoSetup.handleError());
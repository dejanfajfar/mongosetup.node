var mongoSetup = require('./../index.js');
var cp = mongoSetup.collectionPromises;

var connectionData = {
    connectionString : "mongodb://localhost:27017/repair_db"
};

mongoSetup.connectTo(connectionData)
    .then(cp.repair())
    .then(cp.disconnect())
    .catch(mongoSetup.handleError());

var mongo_setup = ms.forDb("mongo://sdsdfsf");

mongo_setup.start(
    mongo_setup.ifExistsCollection("LogEntries")
        .then(mongo_setup.dropCollection("LogEntries"))
        .then(mongo_setup.createCollection("LogEntries"))
        .then(mongo_setup.fillData("LogEntries", [1, 2, 3])),
    mongo_setup.ifNotExistsCollection("AuditTrail")
        .then(mongo_setup.createCollection("AuditTrail"))
).done()
.onError(err => {});
[![travis ci build](https://api.travis-ci.org/dejanfajfar/mongosetup.node.svg)](https://travis-ci.org/dejanfajfar/mongosetup.node)
[![Dependencies](https://david-dm.org/dejanfajfar/mongosetup.node.svg)](https://david-dm.org/dejanfajfar/mongosetup.node)
[![npm version](https://badge.fury.io/js/mongosetup.svg)](https://badge.fury.io/js/mongosetup)


# mongosetup.node

A nodeJs module to write promises based __mongodb__ initialization/update scripts with a nice _cli_ output

![sample output](https://raw.githubusercontent.com/dejanfajfar/mongosetup.node/master/misc/output.png)

# Why?

To create a easy way to initialize your mongodb from scratch. 
 
Create __collections__, __indexes__ and insert initialization data with an easy _fluent_ interface.

If the shiny fluent interface did not convince you then another great point in favor is the ability to run scripts __without a local mongo installation__.

# How?

Simply install the [npm module](https://badge.fury.io/js/mongosetup) using

	$ npm install mongosetup --save

> The _--save_ will add __mongosetup__ to your project dependencies

Using the fluent interface we can create easy to __read__ and __maintain__ initialization and update scripts.

	var mongoSetup = require('mongosetup');
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

# Where to next?

Need more information? Refer to [our wiki](https://github.com/dejanfajfar/mongosetup.node/wiki)

Found something lacking? Write a bug to [our bug tracker](https://github.com/dejanfajfar/mongosetup.node/issues)

---

npm badge provided by [http://badge.fury.io/](http://badge.fury.io/)
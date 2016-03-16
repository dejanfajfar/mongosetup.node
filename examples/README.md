# Examples

In this directory you will find some sample of how __mongosetup__ can be used.

## Create empty collection

> node create_collection.js

Demonstrates how to create an empty collection on the connected DB

## Create index 

> node create_index.js

Demonstrates how to create a index on a given collection

## Create empty collection with options

> node create_collection_options.js

Demonstrates how to create a capped collection with a limited amount of items allowed 

## Drop an existing index

> node drop_index.js

Demonstrates how to remove existing indexes from a given collection

## Repair database

> node repair_database.js

Rebuilds all indexes and releases allocated HDD space after deleting documents from a collection

## Drop collection

> node drop_collection.js

Removes the my_collection collection from the databse

The __my_collection__ collection must already be present in the DB before running the example
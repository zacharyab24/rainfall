/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2001081480")

  // add field
  collection.fields.addAt(3, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_2331940051",
    "hidden": false,
    "id": "relation1971034491",
    "maxSelect": 999,
    "minSelect": 0,
    "name": "rainfall",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2001081480")

  // remove field
  collection.fields.removeById("relation1971034491")

  return app.save(collection)
})

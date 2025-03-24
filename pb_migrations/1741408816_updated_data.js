/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2331940051")

  // update collection rainfalldata
  unmarshal({
    "name": "rainfallData"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2331940051")

  // update collection rainfalldata
  unmarshal({
    "name": "data"
  }, collection)

  return app.save(collection)
})

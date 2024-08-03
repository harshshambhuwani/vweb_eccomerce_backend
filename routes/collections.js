const express = require("express");
const { handleCreateNewCollection, handleGetAllCollection, handleUpdateCollectionById, handleDeleteCollectionById, handleGetAllCollectionByAdminId } = require("../controllers/collections");
const collectionRouter = express.Router();


collectionRouter.route("/")
    .get(handleGetAllCollection)
    .post(handleCreateNewCollection)
    .put(handleUpdateCollectionById)

collectionRouter.route("/admin/:adminId").get(handleGetAllCollectionByAdminId)
collectionRouter.route("/:collectionId").delete(handleDeleteCollectionById)

module.exports = collectionRouter;
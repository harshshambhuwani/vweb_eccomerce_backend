const express = require("express");
const { handleCreateNewCollection, handleGetAllCollection, handleUpdateCollectionById, handleDeleteCollectionById, handleGetAllCollectionByAdminId,handleGetCollectionProducts,handleremoveProductFromCollection } = require("../controllers/collections");
const collectionRouter = express.Router();


collectionRouter.route("/")
    .get(handleGetAllCollection)
    .post(handleCreateNewCollection)
    .put(handleUpdateCollectionById)

collectionRouter.route("/admin/:adminId").get(handleGetAllCollectionByAdminId)
collectionRouter.route("/:collectionId").delete(handleDeleteCollectionById)
collectionRouter.route("/:collectionId/products").get(handleGetCollectionProducts)
collectionRouter.route("/products/:collectionId/:productId").delete(handleremoveProductFromCollection)
module.exports = collectionRouter;
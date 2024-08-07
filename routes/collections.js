const express = require("express");
const { handleCreateNewCollection, handleGetAllCollection, handleUpdateCollectionById,handleGetAllCollectionWithProducts, handleDeleteCollectionById, handleGetAllCollectionByAdminId,handleGetCollectionProducts,handleremoveProductFromCollection,handleGetCollection } = require("../controllers/collections");
const collectionRouter = express.Router();


collectionRouter.route("/")
    .get(handleGetAllCollection)
    .post(handleCreateNewCollection)
    .put(handleUpdateCollectionById)

collectionRouter.route("/admin/:adminId").get(handleGetAllCollectionByAdminId)
collectionRouter.route("/customer/products").get(handleGetAllCollectionWithProducts)
collectionRouter.route("/:collectionId").get(handleGetCollection)
collectionRouter.route("/:collectionId").delete(handleDeleteCollectionById)
collectionRouter.route("/:collectionId/products").get(handleGetCollectionProducts)
collectionRouter.route("/products/:collectionId/:productId").delete(handleremoveProductFromCollection)
module.exports = collectionRouter;
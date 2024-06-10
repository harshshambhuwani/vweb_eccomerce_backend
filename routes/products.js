const express = require("express");
const { handleCreateNewProduct, handleGetAllProduct, handleUpdateProductById, handleDeleteProductById, handleGetAllProductByAdminId } = require("../controllers/products");
const productRouter = express.Router();


productRouter.route("/")
    .get(handleGetAllProduct)
    .post(handleCreateNewProduct)
    .put(handleUpdateProductById)
productRouter.route("/admin/:adminId").get(handleGetAllProductByAdminId)
productRouter.route("/:productId").delete(handleDeleteProductById)

module.exports = productRouter;
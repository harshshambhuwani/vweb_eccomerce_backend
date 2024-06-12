const express = require("express");
const {handleAddToCart,
    handleGetAllCartProducts,
    handleDeleteCartProduct,
    handleUpdateCartProductquantity,
    handleDeleteCart} = require("../controllers/cart");
const cartRouter = express.Router();

cartRouter.route("/:cartId").get(handleGetAllCartProducts)
cartRouter.route("/add-to-cart").post(handleAddToCart)
cartRouter.route("/delete-cart-products").delete(handleDeleteCartProduct)
cartRouter.route("/delete-cart").delete(handleDeleteCart)
cartRouter.route("/update-product-qty").patch(handleUpdateCartProductquantity)

module.exports = cartRouter;
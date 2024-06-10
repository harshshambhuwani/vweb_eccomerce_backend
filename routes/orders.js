const express = require("express");
const {handleGetAllOrdersByAdminId,handleAllOrdersByCustomerId,
    handleCreateOrder,handleOrderStatus,handleGetOrder} = require("../controllers/orders");
const orderRouter = express.Router();

orderRouter.route("/place-order").post(handleCreateOrder);
orderRouter.route("/:customerId").get(handleAllOrdersByCustomerId);
orderRouter.route("/admin/:adminId").get(handleGetAllOrdersByAdminId);
orderRouter.route("/update-status").patch(handleOrderStatus);
orderRouter.route("/details").post(handleGetOrder);

module.exports = orderRouter;
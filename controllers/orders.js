const Orders = require("../models/orders");
const Product = require("../models/products");

// Function to handle getting all orders by admin ID
async function handleGetAllOrdersByAdminId(req, res) {
    const adminId = Number(req.params.adminId);

    try {
        const orders = await Orders.aggregate([
            { $match: { "orderedProducts.adminId": adminId } },
            {
                $unwind: "$orderedProducts"
            },
            {
                $match: { "orderedProducts.adminId": adminId }
            },
            {
                $lookup: {
                    from: "products",
                    localField: "orderedProducts.productId",
                    foreignField: "productId",
                    as: "productDetails"
                }
            },
            {
                $unwind: "$productDetails"
            },
            {
                $group: {
                    _id: "$_id",
                    orderId: { $first: "$orderId" },
                    customerId: { $first: "$customerId" },
                    customerName: { $first: "$customerName" },
                    customerAddress: { $first: "$customerAddress" },
                    city: { $first: "$city" },
                    state: { $first: "$state" },
                    country: { $first: "$country" },
                    pincode: { $first: "$pincode" },
                    mobileNo: { $first: "$mobileNo" },
                    orderStatus: { $first: "$orderStatus" },
                    totalItems: { $first: "$totalItems" },
                    totalAmount: { $first: "$totalAmount" },
                    deliveryDate: { $first: "$deliveryDate" },
                    deliveryStatus: { $first: "$deliveryStatus" },
                    createdAt: { $first: "$createdAt" },
                    updatedAt: { $first: "$updatedAt" },
                    orderedProducts: {
                        $push: {
                            productId: "$orderedProducts.productId",
                            adminId: "$orderedProducts.adminId",
                            quantity: "$orderedProducts.quantity",
                            productDetails: "$productDetails"
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    orderId: 1,
                    customerId: 1,
                    customerName: 1,
                    customerAddress: 1,
                    city: 1,
                    state: 1,
                    country: 1,
                    pincode: 1,
                    mobileNo: 1,
                    orderStatus: 1,
                    totalItems: 1,
                    totalAmount: 1,
                    deliveryDate: 1,
                    deliveryStatus: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    orderedProducts: 1
                }
            }
        ]);

        if (!orders.length) {
            return res.status(200).json({ status:'failed', message: "No orders found" });
        }

        return res.status(200).json({ status: "success", data: orders });
    } catch (error) {
        console.error("Error fetching orders:", error);
        return res.status(500).json({ status:"error", error: "Internal server error" });
    }
}


// Function to handle getting all orders by customer ID
async function handleAllOrdersByCustomerId(req, res) {
    const customerId = req.params.customerId;

    try {
        const orders = await Orders.find({ customerId: customerId }).lean();
        if (!orders || orders.length === 0) {
            return res.status(200).json({ status: 'failed', message: "Order not found" });
        }
        
        // Fetch product details for each product in orderedProducts for all orders
        const allProductIds = orders.flatMap(order => order.orderedProducts.map(op => op.productId));
        
        const products = await Product.find({ productId: { $in: allProductIds.map(Number) } }).lean();
        
        // Create a map of productId to product details
        const productMap = products.reduce((acc, product) => {
            acc[product.productId] = product;
            return acc;
        }, {});
        
        // Add product details to each orderedProduct for each order
        orders.forEach(order => {
            order.orderedProducts = order.orderedProducts.map(op => ({
                ...op,
                productDetails: productMap[op.productId] || null
            }));
        });        
        
        return res.status(200).json({ status: "success", data: orders });
    } catch (error) {
        console.error("Error fetching orders by customer ID:", error);
        return res.status(500).json({ status:"error", error: "Internal server error" });
    }
}

// Function to handle creating a new order
async function handleCreateOrder(req, res) {
    const body = req.body;
    const requiredFields = ['customer_id', 'customer_name', 'customer_address', 'city', 'state', 'country', 'pin_code', 'mobile_number', 'cart_products','total_items','total_amount','delivery_date'];

    // Check for missing fields in the request body
    const missingFields = requiredFields.filter(field => !req.body[field]);
    if (missingFields.length > 0) {
        return res.status(400).json({ status: 'failed',message: 'Missing required fields: ' + missingFields.join(', ') });
    }

    try {
        const allOrders = await Orders.find({}).sort({ orderId: -1 }).lean();
        const newOrderId = allOrders.length > 0 ? allOrders[0].orderId + 1 : 1;

        const result = await Orders.create({
            orderId: newOrderId,
            customerId: body.customer_id,
            customerName: body.customer_name,
            customerAddress: body.customer_address,
            city: body.city,
            state: body.state,
            country: body.country,
            pincode: body.pin_code,
            mobileNo: body.mobile_number,
            orderedProducts: body.cart_products,
            orderStatus: "Pending",
            totalItems: body.total_items,
            totalAmount: body.total_amount, // Update this field with the correct total amount calculation
            deliveryDate: body.delivery_date,
            deliveryStatus: "Pending"
        });

        return res.status(201).json({ status: 'success', message: "Order created successfully", data: result });
    } catch (error) {
        console.error("Error creating order:", error);
        return res.status(500).json({ status:"error", error: "Internal server error" });
    }
}

// Function to handle updating the status of an order
async function handleOrderStatus(req, res) {
    const { order_id, admin_id, order_status } = req.body;

    try {
        const order = await Orders.updateOne({ orderId: order_id }, { orderStatus: order_status });
        if (!order.nModified) {
            return res.status(404).json({ status:'failed', message: "Order not found or status not updated" });
        }
        return res.json({ status: "success", message: `Order has been ${order_status} successfully` });
    } catch (error) {
        console.error("Error updating order status:", error);
        return res.status(500).json({ status:"error", error: "Internal server error" });
    }
}

// Function to handle getting a specific order by ID
async function handleGetOrder(req, res) {
    const { order_id } = req.body;

    try {
        const order = await Orders.findOne({ orderId: order_id });
        if (!order) {
            return res.status(200).json({ status:'failed', message: "Order not found" });
        }
        return res.status(200).json({ status: "success", data: order });
    } catch (error) {
        console.error("Error fetching order:", error);
        return res.status(500).json({ status:"error", error: "Internal server error" });
    }
}

module.exports = {
    handleGetAllOrdersByAdminId,
    handleAllOrdersByCustomerId,
    handleCreateOrder,
    handleOrderStatus,
    handleGetOrder
};

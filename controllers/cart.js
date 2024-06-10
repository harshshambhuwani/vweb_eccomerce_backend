const Cart = require("../models/cart");

// Function to handle adding a product to the cart
async function handleAddToCart(req, res) {
    // Define required fields for the request body
    const requiredFields = ['customer_id', 'product_id','quantity'];
    
    // Check for missing fields in the request body
    const missingFields = requiredFields.filter(field => !req.body[field]);
    if (missingFields.length > 0) {
        return res.status(400).json({ status: 'failed',message: 'Missing required fields: ' + missingFields.join(', ') });
    }

    try {
        const { customer_id, product_id, quantity,admin_id } = req.body;
        // Find existing cart for the customer
        const existingCart = await Cart.findOne({ customerId: Number(customer_id) });

        if (existingCart) {
            // Check if the product is already in the cart
            const productIndex = existingCart.addedProducts.findIndex(product => product.productId === Number(product_id));
            if (productIndex !== -1) {
                // If product exists, increase the quantity
                existingCart.addedProducts[productIndex].quantity += Number(quantity);
            } else {
                // If product does not exist, add the new product to the cart
                existingCart.addedProducts.push({
                    productId: req.body.product_id,
                    quantity: req.body.quantity,
                    adminId:req.body.admin_id
                });
            }
            await existingCart.save(); // Save the updated cart
            return res.status(200).json({ status: 'success',message: "Product quantity updated successfully", data: existingCart });
        } else {
            // If no cart exists for the customer, create a new cart
            const allCartProducts = await Cart.find({}).sort({ cartId: -1 }).lean();
            const newCartId = allCartProducts.length > 0 ? allCartProducts[0].cartId + 1 : 1;

            // Create a new cart with the product details
            const result = await Cart.create({
                cartId: newCartId,
                customerId: Number(customer_id),
                addedProducts: [{
                    productId: req.body.product_id,
                    quantity: req.body.quantity,
                    adminId:req.body.admin_id
                }]
            });

            return res.status(201).json({ status: 'success', message: "Product added to cart successfully", data: result });
        }
    } catch (error) {
        console.error("Error adding product to cart:", error);
        return res.status(500).json({ status:"error", error: "Internal server error" });
    }
}

// Function to handle fetching all products in the cart for a customer
async function handleGetAllCartProducts(req, res) {
    const customerId = req.params.customerId;
    const allCartProducts = await Cart.find({ customerId: customerId });
    try {
        if (!allCartProducts) {
            return res.status(404).json({ status: 'failed', message: "No Data Found" });
        }
        return res.json({ status: "success", data: allCartProducts });
    } catch (error) {
        return res.status(500).json({status:"error", error: "Invalid"})
    }
    
}

// Function to handle deleting a product from the cart
async function handleDeleteCartProduct(req, res) {
    const { customer_id, cart_id, product_id } = req.body;

    if (!customer_id || !cart_id || !product_id) {
        return res.status(400).json({ status: 'failed',message: 'Missing required fields: customer_id, cart_id, product_id' });
    }

    try {
        const cart = await Cart.findOne({ cartId: cart_id, customerId: customer_id });
        if (!cart) {
            return res.status(404).json({status:'failed', message: "Cart not found" });
        }

        const productIndex = cart.addedProducts.findIndex(product => product.productId === product_id);
        if (productIndex === -1) {
            return res.status(404).json({status:'failed', message: "Product not found in cart" });
        }

        cart.addedProducts.splice(productIndex, 1); // Remove the product from the cart
        await cart.save();
        
        return res.status(200).json({ status: "success", message: "Product successfully removed from cart" });
    } catch (error) {
        console.error("Error deleting product from cart:", error);
        return res.status(500).json({ status:"error", error: "Internal server error" });
    }
}

// Function to handle deleting a cart
async function handleDeleteCart(req, res) {
    const { customer_id, cart_id } = req.body;

    if (!customer_id || !cart_id) {
        return res.status(400).json({ status: 'failed',message: 'Missing required fields: customer_id, cart_id' });
    }

    try {
        const cart = await Cart.findOne({ customerId: Number(customer_id), cartId: Number(cart_id) });
        if (!cart) {
            return res.status(404).json({ status:'failed', message: "Cart not found" });
        }
        const deleteCart = await Cart.deleteOne({ customerId: Number(customer_id), cartId: Number(cart_id) });
        console.log(deleteCart);
        return res.status(200).json({ status: "success", message: "Cart successfully removed" });
    } catch (error) {
        console.error("Error deleting cart:", error);
        return res.status(500).json({ status:"error", error: "Internal server error" });
    }
}

// Function to handle updating the quantity of a product in the cart
async function handleUpdateCartProductquantity(req, res) {
    const requiredFields = ['customer_id', 'product_id', 'cart_id', 'quantity'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    if (missingFields.length > 0) {
        return res.status(400).json({ status: 'failed',message: 'Missing required fields: ' + missingFields.join(', ') });
    }

    const { customer_id, product_id, cart_id, quantity } = req.body;
    try {
        const cart = await Cart.findOne({ customerId: Number(customer_id), cartId: Number(cart_id) });
        if (!cart) {
            return res.status(404).json({status:'failed', message: "Cart not found" });
        }
        const productIndex = cart.addedProducts.findIndex(product => product.productId === product_id);
        if (productIndex === -1) {
            return res.status(404).json({status:'failed', message: "Product not found in cart" });
        }
        cart.addedProducts[productIndex].quantity = quantity; // Update the product quantity
        await cart.save();
        return res.status(200).json({ status: "success", message: "Product quantity successfully updated" });
    } catch (error) {
        console.error("Error updating product quantity in cart:", error);
        return res.status(500).json({ status:"error", error: "Internal server error" });
    }
}

// Exporting all the handler functions
module.exports = {
    handleAddToCart,
    handleGetAllCartProducts,
    handleDeleteCartProduct,
    handleUpdateCartProductquantity,
    handleDeleteCart
}

const Products = require("../models/products");

// Function to handle creating a new product
async function handleCreateNewProduct(req, res) {
    const body = req.body;
    const images = req.files;
    console.log(body);
    console.log(images);
    
    const requiredFields = ['admin_id', 'title', 'description', 'category', 'price', 'discount_precentage', 'stocks', 
                            'brand', 'sku', 'weight', 'height', 'width', 'length', 'warranty', 
                            'shipping_info', 'return_policy'];

    // Check for missing fields in the request body
    const missingFields = requiredFields.filter(field => !body[field]);
    if (missingFields.length > 0) { 
        return res.status(400).json({ status: 'failed',message: 'Missing required fields: ' + missingFields.join(', ') });
    }

    try {
        const allProducts = await Products.find({}).sort({ productId: -1 }).lean();
        const productId = allProducts.length > 0 ? allProducts[0].productId + 1 : 1;

            if (!Array.isArray(images.products_images) || images.products_images.length === 0) {
                return res.status(400).json({ status: 'failed',message: 'No files were uploaded.' });
            }
        
            const imageUrls = [];
            images.products_images.forEach(file => {
                const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
                imageUrls.push(imageUrl);
            });
            console.log(imageUrls);

        const availabilityStatus = body.stocks < 15 ? "Few in stocks" : 
                                  body.stocks > 100 ? "In Stock" : 
                                  body.stocks <= 100 ? "Low In Stock" : 
                                  "Out of Stock";

        const result = await Products.create({
            productId: productId,
            adminId: body.admin_id,
            title: body.title,
            description: body.description,
            category: body.category,
            price: body.price,
            discountPercentage: body.discount_precentage,
            stocks: body.stocks,
            availabilityStatus: availabilityStatus,
            brand: body.brand,
            sku: body.sku,
            weight: body.weight,
            height: body.height,
            width: body.width,
            length: body.length,
            warranty: body.warranty,
            shippingInformation: body.shipping_info,
            returnPolicy: body.return_policy,
            imageUrls: imageUrls,
            thumbnail: imageUrls[0],
        });

        return res.status(201).json({ status: 'success', message: "Product created successfully", data: result });
    } catch (error) {
        console.error("Error creating product:", error);
        return res.status(500).json({ status:"error", error: "Internal server error" });
    }
}

// Function to handle fetching all products
async function handleGetAllProduct(req, res) {
    try {
        const allDbProducts = await Products.find();
        if (!allDbProducts.length) {
            return res.status(200).json({ status: 'failed',message: 'No products found' });
        }
        return res.json({ status: "success", data: allDbProducts });
    } catch (error) {
        console.error("Error fetching products:", error);
        return res.status(500).json({ status:"error", error: "Internal server error" });
    }
}

// Function to handle fetching all products by admin ID
async function handleGetAllProductByAdminId(req, res) {
    const adminId = req.params.adminId;
    try {
        const products = await Products.find({ adminId: adminId });
        if (!products.length) {
            return res.status(200).json({ status: 'failed',message: 'No products found' });
        }
        return res.json({ status: "success", data: products });
    } catch (error) {
        console.error("Error fetching products by admin ID:", error);
        return res.status(500).json({ status:"error", error: "Internal server error" });
    }
}

// Function to handle updating a product by ID
async function handleUpdateProductById(req, res) {
    const body = req.body;
    const images = req.files;

    const requiredFields = ['product_id', 'admin_id', 'title', 'description', 'category', 'price', 'discount_precentage', 
                            'stocks', 'brand', 'sku', 'weight', 'height', 'width', 'length', 'warranty', 
                            'shipping_info', 'return_policy','imageUrls'];

    // Check for missing fields in the request body
    const missingFields = requiredFields.filter(field => !body[field]);
    if (missingFields.length > 0) {
        return res.status(400).json({ status: 'failed',message: 'Missing required fields: ' + missingFields.join(', ') });
    }

    try {
        const product = await Products.findOne({ productId: body.product_id });
        if (!product) {
            return res.status(400).json({ status: 'failed',message: 'Product not found' });
        }

        // Update product fields
        product.adminId = body.admin_id;
        product.title = body.title;
        product.description = body.description;
        product.category = body.category;
        product.price = body.price;
        product.discountPercentage = body.discount_precentage;
        product.stocks = body.stocks;
        product.brand = body.brand;
        product.sku = body.sku;
        product.weight = body.weight;
        product.height = body.height;
        product.width = body.width;
        product.length = body.length;
        product.warranty = body.warranty;
        product.shippingInformation = body.shipping_info;
        product.returnPolicy = body.return_policy;
        product.imageUrls = body.imageUrls;

        // Update availability status
        product.availabilityStatus = body.stocks < 15 ? "Few in stocks" : 
                                      body.stocks > 100 ? "In Stock" : 
                                      body.stocks <= 100 ? "Low In Stock" : 
                                      "Out of Stock";

        // Handle new image uploads if provided
        if (images && Array.isArray(images.products_images) && images.products_images.length > 0) {
            const imageUrls = images.products_images.map(file => {
                return `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
            });
            product.imageUrls = imageUrls;
            product.thumbnail = imageUrls[0];
        }

        // Save the updated product
        const updatedProduct = await product.save();

        return res.status(200).json({ status: 'success',message: "Product updated successfully", data: updatedProduct });
    } catch (error) {
        console.error("Error updating product:", error);
        return res.status(500).json({ status: "error", error: "Internal server error" });
    }
}

// Function to handle deleting a product by ID
async function handleDeleteProductById(req, res) {
    const productId = req.params.productId;

    try {
        const productData = await Products.findOne({ productId: productId });
        if (!productData) {
            return res.status(200).json({status:'failed', message: "Product not found" });
        }
        await Products.deleteOne({ productId: productId });
        return res.status(200).json({ status: "success", message: "Product successfully deleted" });
    } catch (error) {
        console.error("Error deleting product:", error);
        return res.status(500).json({ status:"error", error: "Internal server error" });
    }
}

module.exports = {
    handleCreateNewProduct,
    handleGetAllProduct,
    handleGetAllProductByAdminId,
    handleUpdateProductById,
    handleDeleteProductById
};

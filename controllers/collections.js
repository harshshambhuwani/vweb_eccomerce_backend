
const Collections = require("../models/collections");

// Function to handle creating a new Collection
async function handleCreateNewCollection(req, res) {
    const body = req.body;
    // const images = req.files;
    console.log(body); 
    // console.log(images);
    
    const requiredFields = ['admin_id', 'title', 'handle', 'description'];

    // Check for missing fields in the request body
    const missingFields = requiredFields.filter(field => !body[field]);
    if (missingFields.length > 0) {
        return res.status(400).json({ status: 'failed',message: 'Missing required fields: ' + missingFields.join(', ') });
    }

    try {
        const allCollections = await Collections.find({}).sort({ collectionId: -1 }).lean();
        const CollectionId = allCollections.length > 0 ? Number(allCollections[0].collectionId) + 1 : 1;

            // if (!Array.isArray(images.Collections_images) || images.Collections_images.length === 0) {
            //     return res.status(400).json({ status: 'failed',message: 'No files were uploaded.' });
            // }
        
            // const imageUrls = [];
            // images.Collections_images.forEach(file => {
            //     const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
            //     imageUrls.push(imageUrl);
            // });
            // console.log(imageUrls);

        const availabilityStatus = body.stocks < 15 ? "Few in stocks" : 
                                  body.stocks > 100 ? "In Stock" : 
                                  body.stocks <= 100 ? "Low In Stock" : 
                                  "Out of Stock";

        const result = await Collections.create({
            collectionId: String(CollectionId),
            adminId: body.admin_id,
            title: body.title,
            handle:body.handle,
            description: body.description,
            
        });

        return res.status(201).json({ status: 'success', message: "Collection created successfully", data: result });
    } catch (error) {
        console.error("Error creating Collection:", error);
        return res.status(500).json({ status:"error", error: "Internal server error" });
    }
}

// Function to handle fetching all Collections
async function handleGetAllCollection(req, res) {
    try {
        const allDbCollections = await Collections.find();
        if (!allDbCollections.length) {
            return res.status(200).json({ status: 'failed',message: 'No Collections found' });
        }
        return res.json({ status: "success", data: allDbCollections });
    } catch (error) {
        console.error("Error fetching Collections:", error);
        return res.status(500).json({ status:"error", error: "Internal server error" });
    }
}

// Function to handle fetching all Collections by admin ID
async function handleGetAllCollectionByAdminId(req, res) {
    const adminId = req.params.adminId;
    try {
        const Collections = await Collections.find({ adminId: adminId });
        if (!Collections.length) {
            return res.status(200).json({ status: 'failed',message: 'No Collections found' });
        }
        return res.json({ status: "success", data: Collections });
    } catch (error) {
        console.error("Error fetching Collections by admin ID:", error);
        return res.status(500).json({ status:"error", error: "Internal server error" });
    }
}

// Function to handle fetching all Collections
async function handleGetCollectionProducts(req, res) {
    
    const collectionId = req.params.collectionId;

    try {
        // Find the collection and populate the products field
        const collection = await Collections.findOne({ collectionId })
            .populate('products');

        if (!collection) {
            return res.status(404).json({ status: 'failed', message: 'No Collections found' });
        }
        await collection.save();
        return res.json({ status: "success",total_products:collection.products_count, data: collection.products });
    } catch (error) {
        console.error("Error fetching Collections by collection ID:", error);
        return res.status(500).json({ status: "error", error: "Internal server error" });
    }
}

// Function to handle updating a Collection by ID
async function handleUpdateCollectionById(req, res) {
    const body = req.body;
    const requiredFields = ['collection_id', 'admin_id', 'title', 'handle','description',];

    // Check for missing fields in the request body
    const missingFields = requiredFields.filter(field => !body[field]);
    if (missingFields.length > 0) {
        return res.status(400).json({ status: 'failed',message: 'Missing required fields: ' + missingFields.join(', ') });
    }

    try {
        
        const Collection = await Collections.findOneAndUpdate({ collectionId: body.collection_id }, body, { new: true, runValidators: true });
        
        if (!Collection) {
            return res.status(400).json({ status: 'failed',message: 'Collection not found' });
        }
        await Collection.save();
        return res.status(200).json({ status: 'success',message: "Collection updated successfully", data: Collection });
    } catch (error) {
        console.error("Error updating Collection:", error);
        return res.status(500).json({ status:"error", error: "Internal server error" });
    }
}

// Function to handle deleting a Collection by ID
async function handleDeleteCollectionById(req, res) {
    const CollectionId = req.params.collectionId;

    try {
        const CollectionData = await Collections.findOne({ collectionId: CollectionId });
        if (!CollectionData) {
            return res.status(200).json({status:'failed', message: "Collection not found" });
        }
        await Collections.deleteOne({ collectionId: CollectionId });
        return res.status(200).json({ status: "success", message: "Collection successfully deleted" });
    } catch (error) {
        console.error("Error deleting Collection:", error);
        return res.status(500).json({ status:"error", error: "Internal server error" });
    }
}

async function handleremoveProductFromCollection(req, res) {
    const { collectionId, productId } = req.params;

    try {
        const collection = await Collections.findOne({ collectionId });
        if (!collection) {
            return res.status(404).json({ status: 'failed', message: 'Collection not found' });
        }
        collection.products.pull(productId);
        await collection.save(); // This will trigger the pre-save middleware

        return res.status(200).json({ status: 'success', message: 'Product successfully removed from collection'});
    } catch (error) {
        console.error('Error removing product from collection:', error);
        return res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
}

module.exports = {
    handleCreateNewCollection,
    handleGetAllCollection,
    handleGetAllCollectionByAdminId,
    handleUpdateCollectionById,
    handleDeleteCollectionById,
    handleGetCollectionProducts,handleremoveProductFromCollection
};

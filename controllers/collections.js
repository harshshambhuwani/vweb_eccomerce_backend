// "id": 484360356157,
// "title": "2 - 7 Years Boy",
// "handle": "2-7-years",
// "description": "",
// "published_at": "2024-04-04T03:41:00-07:00",
// "updated_at": "2024-04-25T06:38:17-07:00",
// "image": null || 
// {
    //     "id": 1733321425213,
    //     "created_at": "2023-02-02T05:54:27-08:00",
    //     "src": "https://cdn.shopify.com/s/files/1/0681/2794/9117/collections/b1.png?v=1675346068",
    //     "alt": null
    //   },
// "products_count": 0


const Collections = require("../models/collections");

// Function to handle creating a new Collection
async function handleCreateNewCollection(req, res) {
    const body = req.body;
    // const images = req.files;
    console.log(body); 
    // console.log(images);
    
    const requiredFields = ['admin_id', 'title', 'handle', 'category', 'description'];

    // Check for missing fields in the request body
    const missingFields = requiredFields.filter(field => !body[field]);
    if (missingFields.length > 0) {
        return res.status(400).json({ status: 'failed',message: 'Missing required fields: ' + missingFields.join(', ') });
    }

    try {
        const allCollections = await Collections.find({}).sort({ collectionId: -1 }).lean();
        const CollectionId = allCollections.length > 0 ? allCollections[0].collectionId + 1 : 1;

            if (!Array.isArray(images.Collections_images) || images.Collections_images.length === 0) {
                return res.status(400).json({ status: 'failed',message: 'No files were uploaded.' });
            }
        
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
            collectionId: CollectionId,
            adminId: body.admin_id,
            title: body.title,
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

// Function to handle updating a Collection by ID
async function handleUpdateCollectionById(req, res) {
    const body = req.body;
    const requiredFields = ['Collection_id', 'admin_id', 'title', 'description', 'category', 'price', 'discount_precentage', 
                            'stocks', 'brand', 'sku', 'weight', 'height', 'width', 'length', 'warranty', 
                            'shipping_info', 'return_policy'];

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
        return res.status(200).json({ status: 'success',message: "Collection updated successfully", data: Collection });
    } catch (error) {
        console.error("Error updating Collection:", error);
        return res.status(500).json({ status:"error", error: "Internal server error" });
    }
}

// Function to handle deleting a Collection by ID
async function handleDeleteCollectionById(req, res) {
    const CollectionId = req.params.CollectionId;

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

module.exports = {
    handleCreateNewCollection,
    handleGetAllCollection,
    handleGetAllCollectionByAdminId,
    handleUpdateCollectionById,
    handleDeleteCollectionById
};

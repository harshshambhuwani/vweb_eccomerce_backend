const Admin = require("../models/admin");
const Customer = require("../models/customer");
const { setUser } = require("../service/auth");

// Handle Customer and Admin Signup
async function handleSignup(req, res) {
    try {
        const body = req.body;

        if (!body.userType) {
            return res.status(400).json({ status: 'failed',message: 'All fields are required' });
        }

        if (body.userType === "Admin") {
            if (!body.full_name || !body.email || !body.password || !body.company_name) {
                return res.status(400).json({ status: 'failed',message: 'All fields are required' });
            }

            const checkAdminEmail = await Admin.findOne({ email: body.email });
            if (checkAdminEmail) {
                return res.status(400).json({success: "failed",message: "User already exists with this email id",
                });
            }

            const allDbAdmins = await Admin.find({});
            const result = await Admin.create({
                adminId: allDbAdmins.length + 1,
                fullName: body.full_name,
                email: body.email,
                companyName: body.company_name,
                password: body.password,
                profilePic: "",
                userType: body.userType,
            });

            const token = setUser(result.adminId, body.userType);
            return res.status(201).json({ status: 'success', message: "success", token: token, data: result });
        }

        if (body.userType === "Customer") {
            if (!body.full_name || !body.email || !body.password) {
                return res.status(400).json({ status: 'failed',message: 'All fields are required' });
            }

            const checkCustomerEmail = await Customer.findOne({ email: body.email });
            if (checkCustomerEmail) {
                return res.status(400).json({success: "failed",message: "User already exists with this email id",
                });
            }

            const allDbCustomers = await Customer.find({});
            const result = await Customer.create({
                customerId: allDbCustomers.length + 1,
                fullName: body.full_name,
                email: body.email,
                password: body.password,
                profilePic: "",
                userType: body.userType,
            });

            const token = setUser(result.customerId, body.userType);
            return res.status(201).json({ status: 'success', message: "success", token: token, data: result });
        }

        return res.status(400).json({ status: 'failed',message: "Invalid user type" });
    } catch (error) {
        console.error("Error in handleSignup:", error);
        return res.status(500).json({status:"error", error: "Internal server error" });
    }
}

// Handle Customer and Admin Login
async function handleLogin(req, res) {
    try {
        const body = req.body;

        if (!body.userType || !body.email || !body.password) {
            return res.status(400).json({ status: 'failed',message: 'Email, password, and userType are required' });
        }

        if (body.userType === "Admin") {
            const admin = await Admin.findOne({ email: body.email, password: body.password });
            if (!admin) {
                return res.json({ status: "Failed", message: "Invalid Username or Password" });
            }

            const token = setUser(admin.adminId, body.userType);
            return res.status(200).json({ status: "Success", data: admin, token: token });
        }

        if (body.userType === "Customer") {
            const customer = await Customer.findOne({ email: body.email, password: body.password });
            if (!customer) {
                return res.json({ status: "Failed", message: "Invalid Username or Password" });
            }

            const token = setUser(customer.customerId, body.userType);
            return res.status(200).json({ status: "Success", token: token, data: customer });
        }

        return res.status(400).json({ status: 'failed',message: "Invalid user type" });
    } catch (error) {
        console.error("Error in handleLogin:", error);
        return res.status(500).json({ status:"error", error: "Internal server error" });
    }
}

// Handle Get Profile
async function handleGetProfile(req, res) {
    try {
        const { user_id, userType } = req.body;

        if (!user_id || !userType) {
            return res.status(400).json({ status: 'failed', message: "user_id and userType are required" });
        }

        if (userType === "Admin") {
            const admin = await Admin.findOne({ adminId: Number(user_id) });
            if (!admin) {
                return res.status(404).json({ status: 'failed', message: "No admin found" });
            }
            return res.status(200).json({ status: 'success', data: admin });
        } else if (userType === "Customer") {
            const customer = await Customer.findOne({ customerId: Number(user_id) });
            if (!customer) {
                return res.status(404).json({ status: 'failed', message: "No customer found" });
            }
            return res.status(200).json({ status: 'success', data: customer });
        } else {
            return res.status(400).json({ status: 'failed', message: "Invalid userType" });
        }
    } catch (error) {
        console.error("Error in handleGetProfile:", error);
        return res.status(500).json({ status:"error", error: "Internal server error" });
    }
}



// Handle Update Profile
async function handleUpdateProfile(req, res) {
    const { user_id, userType, fullName} = req.body;
    const uploadedImage = req.file;

    console.log(req.body)
    console.log(req.file)

    try {
        let imagePath = '/uploads/' + uploadedImage.filename;
        

        if (userType === "Admin") {
            
            updatedUser = await Admin.findOneAndUpdate( {adminId:user_id}, {fullName:fullName, profilePic: `${req.protocol}://${req.get('host')}${imagePath}`},{ new: true, runValidators: true });
            if (!updatedUser) {
                return res.status(400).json({ status: 'failed',message: 'Not found' });
            }
            if (uploadedImage) {
                return res.status(200).json({ message: "Profile updated successfully", imagePath: `${req.protocol}://${req.get('host')}${imagePath}`, data: updatedUser });
            } else {
                return res.status(200).json({ message: "Profile updated successfully", data: updatedUser });
            }
        } else if (userType === "Customer") {
            

            updatedUser = await Customer.updateOne({customerId:user_id, fullName, profilePic: `http://localhost:8000${imagePath}` });
            const user = await Customer.find({customerId:user_id})
            if (uploadedImage) {
                return res.status(200).json({ message: "Profile updated successfully", imagePath: `http://localhost:8000${imagePath}`, data: user });
            } else {
                return res.status(200).json({ message: "Profile updated successfully", data: user });
            }
            
        } else {
            return res.status(400).json({status: 'failed', message: "Invalid user type" });
        }

        // If the image was uploaded, send its path in the response
        
    } catch (error) {
        console.error("Error updating profile:", error);
        return res.status(500).json({ status:"error", error: "Internal server error" });
    }
}

module.exports = {
    handleSignup,
    handleLogin,
    handleGetProfile,
    handleUpdateProfile
};

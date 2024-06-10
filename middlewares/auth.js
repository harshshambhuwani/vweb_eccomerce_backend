const {getUser} = require("../service/auth");


function checkAuth(req, res, next) {

    const bearerHeader =req.headers['authorization']; 
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        console.log(bearerToken);
        if(!bearerToken){
            console.log("test2")
            return res.status(401).json({status: "error", error: "Unauthorized Access"})
        }
        req.token = bearerToken; 
        const user = getUser(req.token);

        if(!user){
            return res.status(401).json({status:"error",error: "Unauthorized Access"})
        }
        next();
    } else {
        res.status(403).json({status:"error",error: "Unauthorized Access"});
    }
}

module.exports ={checkAuth}
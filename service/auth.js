const jwt = require("jsonwebtoken");
const secretKey = 'jwtHarsh@123@#$';

function setUser(id, userType) {
    const payload = {
        id, 
        userType
    }
    return jwt.sign(payload,secretKey)
}
function getUser(token) {
    if(!token){
        console.log("test1")
        return null;
    }
    try {
        return jwt.verify(token,secretKey)   
    } catch (error) {
        console.log("test2")
        return null;
    }
}

module.exports = {
    setUser,
    getUser
}
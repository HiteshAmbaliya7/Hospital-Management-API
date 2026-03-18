const jwt = require('jsonwebtoken');
const secreat  = process.env.JWT_SECRET;
function setUserId(user)
{
    const payload ={
        _id :user._id,
        email : user.email
    }
    console.log(user);
    return jwt.sign(payload,secreat);
}
function getUserId(token)
{   
    if(!token) return null;
    try {
    
     return jwt.verify(token,secreat )
    }
    catch (error) {
        return null; 
    }
} 
    
   

module.exports = {
    setUserId,
    getUserId,
}
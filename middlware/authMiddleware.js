const jwt = require("jsonwebtoken")
const env = require("../config/env")
module.exports = (req,res,next) =>{
    const token = req.headers.authorization.split(" ")[1];
    try {
        const verify = jwt.verify(token,env.JWT_SECRET)
        if(verify){
            next(true)
        }else{
            next(false,"unauthorized action")
        }
    } catch (error) {
        console.log("err from authmiddleware: ",error)
        next(false,"unauthorized action")
    }
}
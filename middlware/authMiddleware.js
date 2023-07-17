module.exports = (req,res,next) =>{
    console.log("auth middleware called")
    next(true,"un authorized action")
    // if(true){
    //     next(true)
    // }else{
    //     next(false)
    // }
}
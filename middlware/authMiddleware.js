module.exports = (req,res,next) =>{
    console.log("auth middleware called")
    next(false,"unauthorized action")
    // if(true){
    //     next(true)
    // }else{
    //     next(false)
    // }
}
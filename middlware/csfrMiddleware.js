module.exports = (req,res,next) =>{
    console.log("csrf middleware called")
    next(true)
    // if(true){
    //     next(true)
    // }else{
    //     next(false)
    // }
}
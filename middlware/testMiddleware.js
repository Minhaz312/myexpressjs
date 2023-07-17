module.exports = (req,res,next) =>{
    console.log("test middleware called")
    next(true)
    // if(true){
    //     next(true)
    // }else{
    //     next(false)
    // }
}
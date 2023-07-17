module.exports = (req,res,next) =>{
    console.log("sample middleware called")
    next(true,"custom message")
    // if(true){
    //     next(true)
    // }else{
    //     next(false)
    // }
}
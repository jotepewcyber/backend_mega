// const asyncHandler=(fn)=>async (req,res,next)=>{
// try{
// await fn(req,res,next);
// }
// catch(err){
// res.status(err.status || 500).json({
//     success:false,
//     message:err.message || "Internal Server Error"
// })
// }
// }

// export {asyncHandler};







//asyncHandler becomes higher order function, it will take a function as input
//AND returns another function as output
//Thus becomes a wrapper function
const asyncHandler=(requestHandler)=>{
    //req,res,next come automatically from express when HTTP request comes to our server
   return (req,res,next)=>{
//Promise.resolve makes sure if either sync or async functions are passed, it converts them to promise    
Promise.resolve(requestHandler(req,res,next)).catch((err)=>next(err))
    }
}

export {asyncHandler};
import config from "../config/config.js";



// function handleError(err,req,res,next){
//     const response = {
//         message:err.message
//     }
//     if (config.NODE_ENV == "development"){
//         response.stack = err.stack
//     }
//     res.status(err.status).json(response)
// }

// export default handleError;


// import { ApiError } from "../utils/ApiError.js";

export const errorHandler = (err, req, res, next) => {
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Internal Server Error",
      errors: err.errors || [],
      stack: config.NODE_ENV === "development" ? err.stack : undefined
    });
  };
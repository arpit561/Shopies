const jwt = require("jsonwebtoken");
require("dotenv").config();

// authMiddleware
exports.authMiddleware = async (req, res, next) => {
  try {
    // extract token
    const token =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorization").replace("Bearer ", "");
    
      if(!token){
        return res.status(401).json({
          success: false,
          message: "Token is missing",
        })
      }

      // verify the token
      try{
        const decode= jwt.verify(token, process.env.SECRET_KEY);
        console.log(decode);
        req.user= decode;
  } catch (error){
    return res.status(401).json({
      success: false,
      message: "Token is invalid",
    })
  }
  next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Something went wrong while validating the user",
    })
  }
};


// customer
exports.isCustomer= (req, res, next) => {
  try{
    if(!req.user|| req.user.role !== "customer"){
      return res.status(401).json({
        success: false,
        message: "This is the protected route for customer only",
      })
    }
    next();
  } catch(error){
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified",
    })
  }
}

// isShopkeeper
exports.isShopkeeper= (req, res, next) => {
  try{
    if(!req.user|| req.user.role !== "shopkeeper"){
      return res.status(401).json({
        success: false,
        message: "This is the protected route for shopkeeper only",
      })
    }
    next();
  } catch(error){
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified",
    })
  }
}


// isAdmin
exports.isAdmin= (req, res, next) => {
  try{
    if(!req.user ||req.user.role !== "admin"){
      return res.status(401).json({
        success: false,
        message: "This is the protected route for admin only",
      })
    }
    next();
  } catch(error){
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified",
    })
  }
}



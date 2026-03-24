// const jwt = require("jsonwebtoken");
// const User = require("../models/User");
// require("dotenv").config();

// exports.protect = async (req, res, next) => {
//   try {
//     console.log("Middleware hit");
//     console.log(req.body)
//     // Read token from cookies
//     let authHeader = req.headers.authorization || req.headers.Authorization;
//     console.log(authHeader);
//     if (authHeader && authHeader.startsWith("Bearer")) {
//       token = authHeader.split(" ")[1];
//       if (!token) {
//         return res
//           .status(401)
//           .json({ massage: "no token, auhorization denied " });
//       }
//     }
//     // const token = req.cookies.token;
//     // console.log(token);

//     if (!token) {
//       return res.status(401).json({ message: "Not authorized, token missing" });
//     }

//     //  Verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     console.log("DECODED:", decoded);

//     //  Attach user to request
//     const user = await User.findById(decoded.id).select("-password");
//     // console.log(user);
//     if (!user) {
//       return res.status(401).json({ message: "User not found" });
//     }

//     req.user = user;
//     next();
//   } catch (err) {
//     console.log("JWT VERIFY FAILED:", err.message);
//     return res.status(401).json({ message: "Not authorized" });
//   }
// };
// // Authorize specific roles
// exports.authorize = (...roles) => {
//   return (req, res, next) => {
//     console.log(req.body);
//     console.log(req.params);
//     console.log(req.user.role);

//     if (!roles.includes(req.user.role)) {
//       return res.status(403).json({
//         message: `Role '${req.user.role}' is not authorized to access this route`,
//       });
//     }

//     next();
//   };
// };

const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

exports.protect = async (req, res, next) => {
  try {
    let token;

   

    
    let authHeader = req.headers.authorization || req.headers.Authorization;

    if (authHeader && authHeader.startsWith("Bearer")) {
      token = authHeader.split(" ")[1];
    }

   
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

   

    if (!token) {
      return res.status(401).json({ message: "Not authorized, token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();

  } catch (err) {
    console.log(err.message);
    return res.status(401).json({ message: "Not authorized" });
  }
};

// ROLE AUTH
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Role '${req.user.role}' not allowed`,
      });
    }

    next();
  };
};

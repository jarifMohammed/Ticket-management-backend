const jwt = require("jsonwebtoken");

exports.verifyToken = (req,res,next)=>{
    const token = req.cookies.token || req.headers["authorization"]?.split(" ")[1];
    if (!token) {
        return res.status(403).json({ message: "Access denied, token missing!" });
      }

      try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user = decoded;
        next();         
      }catch(err){
        return res.status(401).json({ message: "Invalid token!" });
      }

}

exports.isAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin privileges required" });
    }
    next();
  };
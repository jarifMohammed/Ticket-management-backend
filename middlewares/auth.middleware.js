const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  console.log('Authorization Header:', req.headers['authorization']);
  console.log('Cookies:', req.cookies);

  const token = req.headers['authorization']?.split(' ')[1] || req.cookies.token;

  if (!token) {
    return res.status(403).json({ message: "Access denied, token missing!" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // Attach the user data from the token to the request object
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token!" });
  }
};


exports.checkRole = (roles) => {
  return (req, res, next) => {
    // Ensure req.user is populated and has a role
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: "Unauthorized: No role found" });
    }

    // Check if the user's role is one of the allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: `You are not authorized. Your role is ${req.user.role}, but an authorized role is required.` });
    }

    // Continue to the next middleware if the role is valid
    next();
  };
};

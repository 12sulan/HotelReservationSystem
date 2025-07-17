import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.headers.token;
  if (!token) return res.status(403).json("Token is missing");

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(401).json("Token is not valid");
    req.user = user;
    next();
  });
};

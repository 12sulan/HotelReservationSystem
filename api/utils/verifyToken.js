import jwt from "jsonwebtoken";
import createError from "../utils/error.js";

// Middleware: Verify the JWT token
export const verifyToken = (req, res, next) => {
  console.log(req.cookies);
  const token = req.cookies.access_token;
  console.log("Verifying token:", token);
  if (!token) {
    return next(createError(401, "You are not authenticated!"));
  }

  jwt.verify(token, process.env.JWT, (err, user) => {
    if (err) return next(createError(403, "Token is not valid!"));
    req.user = user;
    next();
  });
};

// Middleware: Check if user matches or is admin
export const verifyUser = (req, res, next) => {
  verifyToken(req, res, () => {
    console.log("user detail", req.user, req.params);
    if (req.user?.id === req.params.id || req.user?.isAdmin) {
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
};

// Middleware: Check if user is admin
export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user?.isAdmin) {
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
};

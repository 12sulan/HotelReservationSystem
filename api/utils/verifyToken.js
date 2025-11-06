import jwt from "jsonwebtoken";
import createError from "../utils/error.js";

// Middleware: Verify the JWT token
export const verifyToken = (req, res, next) => {
  console.log(req.cookies);
  // Try access_token cookie first, then Authorization header as a fallback
  const cookieToken = req.cookies?.access_token;
  const authHeader = req.headers?.authorization;
  const bearerToken = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
  const token = cookieToken || bearerToken;
  console.log("Verifying token:", token ? '[REDACTED]' : token);

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

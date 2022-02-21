import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { SECRET } from "../database";

export const checkToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Get auth header value
  const bearerHeader = req.headers["authorization"];
  // Check if bearer is undefined
  if (typeof bearerHeader !== "undefined") {
    // Split at the space
    const bearer = bearerHeader.split(" ");
    // Get token from array
    const bearerToken = bearer[1];

    jwt.verify(bearerToken, SECRET!, (err, authData) => {
      if (err) {
        res.json({
          code: 2000,
          message: "Token has expired. Please login again.",
        });
      } else {
        console.log("authData -> ", authData);
        // Next middleware
        next();
      }
    });
  } else {
    // Forbidden
    res.json({
      code: 2000,
      message: "Token doesn't exist.",
    });
  }
};

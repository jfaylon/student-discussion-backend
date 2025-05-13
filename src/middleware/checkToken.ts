import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SESSION_SECRET_KEY = process.env.SESSION_SECRET_KEY || "";

export const checkToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, SESSION_SECRET_KEY);
    req.user = decoded as Express.User;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const SESSION_SECRET_KEY = process.env.SESSION_SECRET_KEY || "";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const payload = req.user as {
    user_id: number;
    user_name: string;
    role?: string;
    user_login_id: string;
  };

  const token = jwt.sign(payload, SESSION_SECRET_KEY, { expiresIn: "1h" });

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "strict",
    // TODO: allow this when there is HTTPS connectivity already
    // secure: process.env.NODE_ENV === "production",
  });

  return res.json({ message: "Login successful", token });
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.clearCookie("token");
  return res.json({ message: "Logout successful" });
};

export const me = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  return res.json({
    user_id: req.user.user_id,
    user_name: req.user.user_name,
    role: req.user.role,
    user_login_id: req.user.user_login_id,
  });
};

import { NextFunction, Request, Response } from "express";
import passport from "passport";

export const authenticateLocal = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  passport.authenticate(
    "local",
    { session: false },
    (err: unknown, user: Express.User, info: { message?: string }) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      req.user = user;
      next();
    },
  )(req, res, next);
};

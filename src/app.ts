import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express from "express";
import passport from "./passport";
import router from "./routes";
import cookieParser from "cookie-parser";

declare global {
  namespace Express {
    interface User {
      user_id: number;
      user_name: string;
      role?: string;
      user_login_id?: string;
    }
  }
}

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(","),
    credentials: true,
  }),
);

// Passport middleware
app.use(passport.initialize());

app.use(router);

app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
      error: {
        message: err.message || "Internal Server Error",
      },
    });
  },
);

export default app;

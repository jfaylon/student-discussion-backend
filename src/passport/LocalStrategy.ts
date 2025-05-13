import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import Credential from "../models/Credential";
import Login from "../models/Login";
import User from "../models/User";

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const credential = await Credential.findOne({
        where: { user_login_id: username, type: "password" },
        include: [{ model: Login, include: [User] }],
      });

      if (!credential || !credential.verifyPassword(password)) {
        return done(null, false, { message: "Invalid credentials" });
      }

      const user = credential.Login?.User;
      if (!user) return done(null, false, { message: "User not found" });

      return done(null, {
        user_id: user.user_id,
        user_login_id: credential.user_login_id,
        role: user.user_state === "admin" ? "admin" : "user",
      });
    } catch (err) {
      console.error("Error during authentication:", err);
      return done(err);
    }
  }),
);

export default passport;

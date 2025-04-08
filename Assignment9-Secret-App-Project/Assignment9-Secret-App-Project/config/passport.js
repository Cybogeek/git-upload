import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const configurePassport = (passport) => {
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email });
          if (!user)
            return done(null, false, {
              message: "Incorrect email or password.",
            });

          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch)
            return done(null, false, {
              message: "Incorrect email or password.",
            });

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => {
    User.findById(id).then((user) =>
      user ? done(null, user) : done(null, false)
    );
  });
};

export default configurePassport;

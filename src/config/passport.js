import mongoose from "mongoose";
import passport from "passport";
import LocalStrategy from "passport-local";

import { User } from "../models";

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    if (user) {
      done(null, user);
    } else {
      done(null, null);
    }
  });
});

passport.use(
  "signup",
  new LocalStrategy(
    {
      usernameField: "login",
      passwordField: "password",
      passReqToCallback: true
    },
    (req, login, password, done) => {
      User.findOne({
        $or: [{ login }, { email: req.body.email }]
      })
        .then(user => {
          if (!user || user === null) {
            const data = new User({
              _id: mongoose.Types.ObjectId(),
              login,
              email: req.body.email,
              password
            });
            data
              .save()
              .then(userData => done(null, userData, userData))
              .catch(error => {
                console.log(error);
                return done(null, null, error.message);
              });
          } else {
            done(null, null, "User existed");
          }
        })
        .catch(error => {
          console.log(error);
          return done(error);
        });
    }
  )
);

passport.use(
  "signin",
  new LocalStrategy(
    {
      usernameField: "login",
      passwordField: "password",
      passReqToCallback: true
    },
    (req, login, password, done) => {
      User.findOne({ $or: [{ login }, { email: login }] })
        .then(user => {
          if (user && user !== undefined) {
            if (user.password === req.body.password) {
              return done(null, user, user);
            }
            return done(null, null, "Incorect password");
          }
          return done(null, null, "Incorect login");
        })
        .catch(error => done(null, null, error.message));
    }
  )
);

export default passport;

const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const User = require("../models/User");

// It accepts the passport object to configure it.
// passport.use defines the local authentication strategy using email and password.
// Inside the strategy it looks for a user with the given email.
// If found, it checks if the user has a password set.
// If password is set, it calls comparePassword to check against the input.
// On success, user is passed to the done callback, on failure, false is passed.
// passport.serializeUser defines how passport will serialize the user into the session. Here it just uses the user id.
// passport.deserializeUser defines how to lookup the user again given only the id. It queries for the full user object.
// This links the user id in the session to the actual user object.

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      User.findOne({ email: email.toLowerCase() }, (err, user) => {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, { msg: `Email ${email} not found.` });
        }
        if (!user.password) {
          return done(null, false, {
            msg:
              "Your account was registered using a sign-in provider. To enable password login, sign in using a provider, and then set a password under your user profile.",
          });
        }
        user.comparePassword(password, (err, isMatch) => {
          if (err) {
            return done(err);
          }
          if (isMatch) {
            return done(null, user);
          }
          return done(null, false, { msg: "Invalid email or password." });
        });
      });
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user));
  });
};

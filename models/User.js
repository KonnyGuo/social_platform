const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userName: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String,
});

// Password hash middleware.
// UserSchema.pre("save") defines a pre-save hook that runs before a user document is saved.
// It checks if the password field is modified using isModified("password").
// If password is not modified, it calls next() to move to the next middleware without hashing the password.
// If password is modified, it generates a salt using bcrypt.genSalt(). The salt is used to secure the hashing process.
// The salt is then used to hash the plain text password using bcrypt.hash().
// The hashed password generated is saved back to the user document replacing the original plain text password.
// Calls next() to proceed with saving the document with the hashed password now.

UserSchema.pre("save", function save(next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

// Helper method for validating user's password.

// Defines a method comparePassword on UserSchema.methods.
// It takes the candidate password (e.g. from login form) as the first parameter.
// The user's hashed password is accessed via this.password.
// bcrypt's compare() method is used to compare the candidate password with the hashed password.
// compare() takes the plain and hashed passwords, checks if they match, and returns true or false via the isMatch parameter in the callback.
// Any error is returned via the err parameter in the callback.
// The callback function cb() is called with err and isMatch once the comparison is completed.
// This method can be used during login to compare the password entered by the user with the hashed password stored for that user during registration.
// If there is a match, authentication succeeds. If not, authentication fails.

UserSchema.methods.comparePassword = function comparePassword(
  candidatePassword,
  cb
) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};

module.exports = mongoose.model("User", UserSchema);

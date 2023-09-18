module.exports = {
  ensureAuth: function (req, res, next) {
    //check if user is login
    //user session compared with user.id
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect("/");
    }
  },
  ensureGuest: function (req, res, next) {
    //check if user is not login
    if (!req.isAuthenticated()) {
      return next();
    } else {
      res.redirect("/dashboard");
    }
  },
};

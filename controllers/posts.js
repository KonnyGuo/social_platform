const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");

module.exports = {
  getProfile: async (req, res) => {
    try {
      const posts = await Post.find({ user: req.user.id });
      res.render("profile.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: "desc" }).lean();
      res.render("feed.ejs", { posts: posts });
    } catch (err) {
      console.log(err);
    }
  },
  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      res.render("post.ejs", { post: post, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  createPost: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      await Post.create({
        title: req.body.title,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        caption: req.body.caption,
        likes: 0,
        user: req.user.id,
      });
      console.log("Post has been added!");
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  },
  likePost: async (req, res) => {
    try {
      await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
        }
      );
      console.log("Likes +1");
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  deletePost: async (req, res) => {
    try {
      // Find post by id
      let post = await Post.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(post.cloudinaryId);
      // Delete post from db
      await Post.remove({ _id: req.params.id });
      console.log("Deleted Post");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },
};

// The req.user object populated by Passport.js contains the full user document of the currently logged in user.

// For example, if you have a User model like:

// const UserSchema = new mongoose.Schema({
//   firstName: String,
//   lastName: String,
//   email: String
// });
// When a user authenticates, the req.user will be the MongoDB document representing that user:

// // req.user after login
// req.user = {
//   _id: '123abc',
//   firstName: 'John',
//   lastName: 'Doe',
//   email: 'john@gmail.com' 
// }
// So req.user contains:

// The user ID (_id field)
// All the fields on the User model (firstName, lastName, etc)
// Any custom fields you added to the model
// This allows you to access the user's information in request handlers via req.user after they log in.

// Some common operations:

// // Get user ID 
// const userId = req.user._id;

// // Get user email
// const email = req.user.email; 

// // Check if admin user
// if(req.user.role === 'admin') {
//   // admin user
// }
// So in summary, req.user contains the entire user document which gives you access to any fields in the User model for the authenticated user.
const mongoose = require("mongoose");
const blogModel = require("../models/blogModel");
const userModel = require("../models/userModel");

//GET ALL BLOGS
const getAllBlogsController = async (req, res) => {
  try {

    const blogs = await blogModel.find({}).populate("user"); // Populate the 'user' field
    if (!blogs || blogs.length === 0) {
      // Check if no blogs found
      return res.status(200).send({
        success: false,
        message: "No Blogs Found",
      });
    }
    return res.status(200).send({
      success: true,
      BlogCount: blogs.length,
      message: "All Blogs lists",
      blogs,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error While Getting Blogs",
      error,
    });
  }
};

// const getAllBlogsController = async (req, res) => {
//   try {
//     const blogs = await blogModel.find({}).populate("user");
//     if (!blogs) {
//       return res.status(200).send({
//         success: false,
//         message: "No Blogs Found",
//       });
//     }
//     return res.status(200).send({
//       success: true,
//       BlogCount: blogs.length,
//       message: "All Blogs lists",
//       blogs,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send({
//       success: false,
//       message: "Error WHile Getting Blogs",
//       error,
//     });
//   }
// };
const createBlogController = async (req, res) => {
  try {
    const { title, description, user } = req.body;
    const url = req.file.path;
    const filename = req.file.filename;
    console.log(url, filename);
    // Validation
    if (!title || !description || !url || !user) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields.",
      });
    }

    // Check if the user exists
    const existingUser = await userModel.findById(user);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Create a new blog post
    const newBlog = new blogModel({ title, description, user });
    newBlog.image = { url, filename };

    // Use transactions for data consistency
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      await newBlog.save({ session });
      existingUser.blogs.push(newBlog);
      await existingUser.save({ session });
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }

    // Return success response
    return res.status(201).json({
      success: true,
      message: "Blog created successfully.",
      newBlog,
    });
  } catch (error) {
    console.error("Error creating blog:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while creating the blog.",
      error: error.message,
    });
  }
};

//Create Blog
// const createBlogController = async (req, res) => {
//   try {
//     const { title, description, user } = req.body;
//     let url = req.file.path;
//     let filename = req.file.filename;

//     console.log(url);
//     console.log(filename);
//     //validation
//     if (!title || !description || !url || !filename || !user) {
//       return res.status(400).send({
//         success: false,
//         message: "Please Provide ALl Fields",
//       });
//     }
//     const exisitingUser = await userModel.findById(user);
//     //validaton
//     if (!exisitingUser) {
//       return res.status(404).send({
//         success: false,
//         message: "unable to find user",
//       });
//     }

//     const newBlog = new blogModel({ title, description, user });
//     newBlog.image = { url, filename };
//     const session = await mongoose.startSession();
//     session.startTransaction();
//     await newBlog.save({ session });
//     exisitingUser.blogs.push(newBlog);
//     await exisitingUser.save({ session });
//     await session.commitTransaction();
//     await newBlog.save();
//     return res.status(201).send({
//       success: true,
//       message: "Blog Created!",
//       newBlog,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(400).send({
//       success: false,
//       message: "Error While Creating blog",
//       error,
//     });
//   }
// };

//Update Blog
const updateBlogController = async (req, res) => {
  try {
    const { id } = req.params;

    const url = req.file.path;
    const filename = req.file.filename;
    const blog = await blogModel.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );
    blog.image = { url, filename };
    await blog.save();
    return res.status(200).send({
      success: true,
      message: "Blog Updated!",
      blog,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      message: "Error WHile Updating Blog",
      error,
    });
  }
};

//SIngle Blog
const getBlogByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await blogModel.findById(id);
    if (!blog) {
      return res.status(404).send({
        success: false,
        message: "blog not found with this is",
      });
    }
    return res.status(200).send({
      success: true,
      message: "fetch single blog",
      blog,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      message: "error while getting single blog",
      error,
    });
  }
};

//Delete Blog
const deleteBlogController = async (req, res) => {
  try {
    const blog = await blogModel
      // .findOneAndDelete(req.params.id)
      .findByIdAndDelete(req.params.id)
      .populate("user");
    await blog.user.blogs.pull(blog);
    await blog.user.save();
    return res.status(200).send({
      success: true,
      message: "Blog Deleted!",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      message: "Erorr WHile Deleteing BLog",
      error,
    });
  }
};

//GET USER BLOG
const userBlogController = async (req, res) => {
  try {
    const userBlog = await userModel.findById(req.params.id).populate("blogs");

    if (!userBlog) {
      return res.status(404).send({
        success: false,
        message: "blogs not found with this id",
      });
    }
    return res.status(200).send({
      success: true,
      message: "user blogs",
      userBlog,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      message: "error in user blog",
      error,
    });
  }
};

module.exports = {
  getAllBlogsController,
  createBlogController,
  updateBlogController,
  deleteBlogController,
  userBlogController,
  getBlogByIdController,
};

const express = require("express");
const {
  getAllBlogsController,
  createBlogController,
  updateBlogController,
  deleteBlogController,
  userBlogController,
  getBlogByIdController,
} = require("../controllers/blogController");
const multer = require("multer");
const { storage } = require("../cloudConfig");

const upload = multer({
  storage,
  limits: { fieldSize: 25 * 1024 * 1024 },
});

const router = express.Router();
// Get a single blog by ID
router.get("/get-blog/:id", getBlogByIdController);
// Get all blogs
router.get("/all-blog", getAllBlogsController);

// Create a blog
router.post("/create-blog", upload.single("image") , createBlogController);

// Update a blog
router.put("/update-blog/:id", upload.single("image"), updateBlogController);

// Delete a blog
router.delete("/delete-blog/:id", deleteBlogController);



// Get blogs by user ID
router.get("/user-blog/:id", userBlogController);

module.exports = router;

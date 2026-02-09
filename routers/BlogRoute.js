const express = require("express");
const router = express.Router();
const upload = require("../config/uploads");
const Blogs = require("../controllers/Blog/BlogController");

router.post(
  "/blogs",
  upload.fields([
    { name: "blogImages", maxCount: 6 },
    { name: "blogBackgroungImage", maxCount: 1 },
    { name: "blogCardImage", maxCount: 1 },
  ]),
  Blogs.createBlog
);

router.get("/blogs", Blogs.getAllBlogs);

router.get("/blog-title", Blogs.getAllBlogsTitle);

router.get("/blogs/:blogTitle", Blogs.getBlogById);

router.put(
  "/blogs/:blogId",
  upload.fields([
    { name: "blogImages", maxCount: 3 },
    { name: "blogBackgroungImage", maxCount: 1 },
    { name: "blogCardImage", maxCount: 1 },
  ]),
  Blogs.updateBlog
);

router.delete("/blogs/:blogId", Blogs.deleteBlog);

module.exports = router;
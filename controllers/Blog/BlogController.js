const Blog = require("../../model/Blogs/Blog");
const baseUrl = "http://localhost:5001/upload/";
exports.createBlog = async (req, res) => {
  try {
    // console.log("Request Body:", req.body);

    // Create a blogData object from the incoming request body
    const blogData = {
      blogName: req.body.blogName,
      blogTitle: req.body.blogTitle,
      blogDescription: req.body.blogDescription,
      blogHeading: req.body.blogHeading.map((heading, index) => {
        // Map through each heading and gather the points
        const points = [];
        let i = 0;

        // While there are points available, keep collecting them
        while (req.body[`blogHeading[${index}].points[${i}][pointTitle]`]) {
          points.push({
            pointTitle:
              req.body[`blogHeading[${index}].points[${i}][pointTitle]`],
            pointDescription:
              req.body[`blogHeading[${index}].points[${i}][pointDescription]`],
          });
          i++;
        }

        // Return the heading object with nested points
        return {
          headingTitle: heading.headingTitle,
          headingDescription: heading.headingDescription,
          points: points,
        };
      }),
      blogImages: [],
      blogBackgroungImage: null,
      blogCardImage: null,
    };

    // Handle uploaded files
    if (req.files) {
      if (req.files.blogImages) {
        blogData.blogImages = req.files.blogImages.map((file) => file.filename);
      }

      if (req.files.blogBackgroungImage) {
        blogData.blogBackgroungImage =
          req.files.blogBackgroungImage[0].filename;
      }

      if (req.files.blogCardImage) {
        blogData.blogCardImage = req.files.blogCardImage[0].filename;
      }
    }

    // console.log("Blog Data:", blogData); // Log the blogData to check the structure
    //
    // Create a new Blog instance with the populated blogData
    const newBlog = new Blog(blogData);

    // Save the blog to the database
    await newBlog.save();

    res
      .status(201)
      .json({ message: "Blog created successfully", blog: newBlog });
  } catch (error) {
    console.error("Error creating blog:", error);
    res
      .status(500)
      .json({ message: "An error occurred while creating the blog" });
  }
};
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find(); // Fetch all blogs

    // Map over blogs to update image URLs
    const formattedBlogs = blogs.map((blog) => {
      return {
        ...blog._doc, // Spread existing blog data
        blogImages: blog.blogImages.map((image) => `${baseUrl}${image}`), // Append baseUrl to blogImages
        blogBackgroundImage: blog.blogBackgroundImage // Fix typo and no need to map if not an array
          ? `${baseUrl}${blog.blogBackgroundImage}` // Ensure it's handled if it exists
          : null, // Handle case where it's null
        blogCardImage: blog.blogCardImage
          ? `${baseUrl}${blog.blogCardImage}` // Append baseUrl to blogCardImage
          : null,
      };
    });

    res.status(200).json({ blogs: formattedBlogs });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching the blogs" });
  }
};
exports.getAllBlogsTitle = async (req, res) => {
  try {
    const blogs = await Blog.find({}, { blogTitle: 1, blogName: 1, _id: 0 });
    const formattedBlogs = blogs.map((blog) => ({
      title: blog.blogTitle,
      name: blog.blogName,
    }));

    res.status(200).json({ blogs: formattedBlogs });
  } catch (error) {
    console.error("Error fetching blog titles and names:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching the blog titles and names" });
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const { blogTitle } = req.params;
    // console.log(blogTitle);
    // Find the blog by title instead of ID
    const blog = await Blog.findOne({ blogTitle: blogTitle });
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Format the blog object to include the baseUrl for images
    const formattedBlog = {
      ...blog._doc, // Spread existing blog data
      blogImages: blog.blogImages.map((image) => `${baseUrl}${image}`), // Append baseUrl to blogImages
      blogBackgroundImage: blog.blogBackgroungImage.map(
        (image) => `${baseUrl}${image}`
      ),
      blogCardImage: blog.blogCardImage
        ? `${baseUrl}${blog.blogCardImage}`
        : null, // Append baseUrl to blogCardImage
    };

    res.status(200).json({ blog: formattedBlog });
  } catch (error) {
    console.error("Error fetching blog:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching the blog" });
  }
};

// Update a blog by ID
exports.updateBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const updatedData = req.body;

    // If files are uploaded, handle the file uploads
    if (req.files) {
      // Handle blogImages (multiple images)
      if (req.files.blogImages) {
        updatedData.blogImages = req.files.blogImages.map(
          (file) => file.filename
        );
      }

      // Handle blogBackgroundImage (single image)
      if (req.files.blogBackgroungImage) {
        updatedData.blogBackgroungImage =
          req.files.blogBackgroungImage[0].filename;
      }

      // Handle blogCardImage (single image)
      if (req.files.blogCardImage) {
        updatedData.blogCardImage = req.files.blogCardImage[0].filename;
      }
    }

    // Find the blog by its ID and update it with the provided data
    const updatedBlog = await Blog.findByIdAndUpdate(blogId, updatedData, {
      new: true, // Return the updated blog
      runValidators: true, // Run validation on updated data
    });

    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res
      .status(200)
      .json({ message: "Blog updated successfully", blog: updatedBlog });
  } catch (error) {
    console.error("Error updating blog:", error);
    res
      .status(500)
      .json({ message: "An error occurred while updating the blog" });
  }
};

// Delete a blog by ID
exports.deleteBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    console.log(blogId);
    // Find the blog by its ID and delete it
    const deletedBlog = await Blog.findByIdAndDelete(blogId);
    if (!deletedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the blog" });
  }
};

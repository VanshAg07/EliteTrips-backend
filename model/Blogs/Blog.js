const mongoose = require("mongoose");

const Blogs = new mongoose.Schema({
  blogName: {
    type: String,
    required: true,
  },
  blogTitle: {
    type: String,
    required: true,
  },
  blogDescription: {
    type: String,
    required: true,
  },
  blogHeading: [
    {
      headingTitle: {
        type: String,
        required: true,
      },
      headingDescription: {
        type: String,
        required: true,
      },
      points: [
        {
          pointTitle: {
            type: String,
            required: true,
          },
          pointDescription: {
            type: String,
            required: true,
          },
        },
      ],
    },
  ],
  blogImages: [
    {
      type: String,
      required: true,
    },
  ],
  blogBackgroungImage: [
    {
      type: String,
      required: true,
    },
  ],
  blogCardImage: [
    {
      type: String,
      required: true,
    },
  ],
});

module.exports = mongoose.model("Blog", Blogs);
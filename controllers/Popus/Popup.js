const SignIn = require("../../model/PopUp/SignIn");
const AssistForm = require("../../model/PopUp/AssisForm");
const Assist = require("../../model/PopUp/Assist");
const HaventSignIn = require("../../model/PopUp/HaventSign");
const AuthImage = require("../../model/AuthModel/AuthImage");
const StateImages = require("../../model/AuthModel/StateImages");
const baseUrl = "https://elitetrips-backend.onrender.com/upload/";

exports.createSignIn = async (req, res) => {
  try {
    const signIn = new SignIn({
      title: req.body.title,
      subTitle: req.body.subTitle,
      status: req.body.status === "true",
      image:
        req.files && req.files.image
          ? req.files.image.map((file) => file.filename)
          : [],
    });
    await signIn.save();
    res.status(201).json(signIn);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getSignIn = async (req, res) => {
  try {
    const signIn = await SignIn.find();
    if (!signIn) return res.status(404).json({ message: "Sign In not found" });
    res.json(signIn);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSignIn = async (req, res) => {
  try {
    const { title, subTitle, status } = req.body;

    const signIn = await SignIn.findById(req.params.id);
    if (!signIn) return res.status(404).json({ message: "Sign In not found" });

    // Update title and subtitle if provided
    if (title) signIn.title = title;
    if (subTitle) signIn.subTitle = subTitle;

    // Update status if provided
    if (status !== undefined) signIn.status = status === "true";

    // Replace images with new ones if provided
    if (req.files && req.files.image) {
      const newImages = req.files.image.map((file) => file.filename);
      signIn.image = newImages; // Replace the old images with new ones
    }

    await signIn.save();
    res.json(signIn);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteSignIn = async (req, res) => {
  try {
    const signIn = await SignIn.findByIdAndDelete(req.params.id);
    if (!signIn) return res.status(404).json({ message: "Sign In not found" });
    res.json(signIn);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createHavent = async (req, res) => {
  try {
    const signIn = new HaventSignIn({
      title: req.body.title,
      subTitle: req.body.subTitle,
      image:
        req.files && req.files.image
          ? req.files.image.map((file) => file.filename)
          : [],
    });
    await signIn.save();
    res.status(201).json(signIn);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getHavent = async (req, res) => {
  try {
    const signIn = await HaventSignIn.find();
    if (!signIn) return res.status(404).json({ message: "Sign In not found" });
    res.json(signIn);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateHavent = async (req, res) => {
  try {
    const { title, subTitle } = req.body;
    const signIn = await HaventSignIn.findById(req.params.id);
    if (!signIn) return res.status(404).json({ message: "Sign In not found" });

    // Update title and subtitle if provided
    if (title) signIn.title = title;
    if (subTitle) signIn.subTitle = subTitle;

    // Replace images with new ones if provided
    if (req.files && req.files.image) {
      const newImages = req.files.image.map((file) => file.filename);
      signIn.image = newImages; // Replace the old images with new ones
    }

    await signIn.save();
    res.json(signIn);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteHavent = async (req, res) => {
  try {
    const signIn = await HaventSignIn.findByIdAndDelete(req.params.id);
    if (!signIn) return res.status(404).json({ message: "Sign In not found" });
    res.json(signIn);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createAssist = async (req, res) => {
  try {
    const assist = new Assist({
      title: req.body.title,
      status: req.body.status === 'true',
      image:
        req.files && req.files.image
          ? req.files.image.map((file) => file.filename)
          : [],
    });
    await assist.save();
    res.status(201).json(assist);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAssist = async (req, res) => {
  try {
    const signIn = await Assist.find();
    if (!signIn) return res.status(404).json({ message: "Sign In not found" });
    res.json(signIn);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateAssist = async (req, res) => {
  try {
    const { title, subTitle, status } = req.body;
    const assist = await Assist.findById(req.params.id);
    if (!assist) return res.status(404).json({ message: "Assist not found" });

    if (title) assist.title = title;
    if (subTitle) assist.subTitle = subTitle;

    if (status !== undefined) {
      assist.status = status === 'true'; 
    }

    if (req.files && req.files.image) {
      const newImages = req.files.image.map((file) => file.filename);
      assist.image = newImages;
    }

    await assist.save();
    res.json(assist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.deleteAssist = async (req, res) => {
  try {
    const signIn = await Assist.findByIdAndDelete(req.params.id);
    if (!signIn) return res.status(404).json({ message: "Sign In not found" });
    res.json(signIn);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const nodemailer = require("nodemailer");

exports.createAssistForm = async (req, res) => {
  try {
    const name = req.body.name;
    const number = req.body.number;
    const interestedPlaces = req.body.interestedPlaces;
    const email = req.body.email;

    // Set up the email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail", // You can use any service (e.g., Gmail, SendGrid, etc.)
      auth: {
        user: "EliteTripsindia@gmail.com", // Replace with your email
        pass: "yxpp sdrq ihek xhac", // Replace with your email password or app-specific password
      },
    });

    // Compose the email content
    const mailOptions = {
      from: "EliteTripsindia@gmail.com",
      to: "EliteTripsindia@gmail.com", // Replace with the admin's email address
      subject: "New Assist Form Submission",
      html: `
        <h2>New Assist Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone Number:</strong> ${number}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Interested Places:</strong> ${interestedPlaces}</p>
        <p><em>Thank you for reviewing the submission!</em></p>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Send a success response back to the client
    res.status(201).json({
      message: "Assist Form submitted successfully and email sent to admin.",
    });
  } catch (error) {
    // Send an error response in case of failure
    res.status(400).json({ message: error.message });
  }
};

exports.getAssistForm = async (req, res) => {
  try {
    const assistForm = await AssistForm.find();
    if (!assistForm) return res.status(404).json({ message: "Assist Form" });

    res.json(assistForm);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSignInUser = async (req, res) => {
  try {
    const signIn = await SignIn.find();
    if (!signIn || signIn.length === 0) {
      return res.status(404).json({ message: "Sign In not found" });
    }
    // Map through the signIn array and prepend the image path with baseUrl
    const signInWithImageUrls = signIn.map((item) => {
      if (item.image && item.image.length > 0) {
        item.image = item.image.map((image) => baseUrl + image); // Append image filenames to the base URL
      }
      return item;
    });

    res.json(signInWithImageUrls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAssistUser = async (req, res) => {
  try {
    const signIn = await Assist.find();
    if (!signIn || signIn.length === 0) {
      return res.status(404).json({ message: "Sign In not found" });
    }
    // Map through the signIn array and prepend the image path with baseUrl
    const signInWithImageUrls = signIn.map((item) => {
      if (item.image && item.image.length > 0) {
        item.image = item.image.map((image) => baseUrl + image); // Append image filenames to the base URL
      }
      return item;
    });

    res.json(signInWithImageUrls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getHaventUser = async (req, res) => {
  try {
    const signIn = await HaventSignIn.find();
    if (!signIn || signIn.length === 0) {
      return res.status(404).json({ message: "Sign In not found" });
    }
    // Map through the signIn array and prepend the image path with baseUrl
    const signInWithImageUrls = signIn.map((item) => {
      if (item.image && item.image.length > 0) {
        item.image = item.image.map((image) => baseUrl + image); // Append image filenames to the base URL
      }
      return item;
    });

    res.json(signInWithImageUrls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to convert Google Drive URL to lh3 format
const convertGoogleDriveUrl = (url) => {
  if (!url || typeof url !== 'string') return url;
  
  // If already using lh3.googleusercontent.com, return as is
  if (url.includes('lh3.googleusercontent.com')) {
    return url;
  }
  
  let fileId = null;
  
  // Format: https://drive.google.com/file/d/FILE_ID/view
  const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) {
    fileId = fileMatch[1];
  }
  
  // Format: https://drive.google.com/open?id=FILE_ID or uc?id=
  if (!fileId) {
    const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (idMatch) {
      fileId = idMatch[1];
    }
  }
  
  if (fileId) {
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  }
  
  return url;
};

exports.createAuthImage = async (req, res) => {
  try {
    let phoneImages = [];
    let images = [];

    // Check for URL-based inputs from request body
    const { imageUrl, phoneImageUrl } = req.body;
    
    if (imageUrl) {
      // Handle single URL or array of URLs
      if (Array.isArray(imageUrl)) {
        images = imageUrl.map(url => convertGoogleDriveUrl(url));
      } else {
        images = [convertGoogleDriveUrl(imageUrl)];
      }
    } else if (req.files?.image) {
      images = req.files.image.map((file) => file.filename);
    }

    if (phoneImageUrl) {
      if (Array.isArray(phoneImageUrl)) {
        phoneImages = phoneImageUrl.map(url => convertGoogleDriveUrl(url));
      } else {
        phoneImages = [convertGoogleDriveUrl(phoneImageUrl)];
      }
    } else if (req.files?.phoneImage) {
      phoneImages = req.files.phoneImage.map((file) => file.filename);
    }

    const signIn = new AuthImage({
      phoneImage: phoneImages,
      image: images,
    });

    await signIn.save();
    res.status(201).json(signIn);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAuthImage = async (req, res) => {
  try {
    const signIn = await AuthImage.find();
    if (!signIn) return res.status(404).json({ message: "Sign In not found" });
    
    // Fix URLs for display - convert old Google Drive URLs to new format
    const signInWithFixedUrls = signIn.map((item) => {
      const updatedItem = item.toObject();
      
      if (updatedItem.image && updatedItem.image.length > 0) {
        updatedItem.image = updatedItem.image.map((img) => {
          // If it's already a full URL, fix it to lh3 format
          if (img.startsWith('http')) {
            return convertGoogleDriveUrl(img);
          }
          return img;
        });
      }
      if (updatedItem.phoneImage && updatedItem.phoneImage.length > 0) {
        updatedItem.phoneImage = updatedItem.phoneImage.map((img) => {
          if (img.startsWith('http')) {
            return convertGoogleDriveUrl(img);
          }
          return img;
        });
      }
      return updatedItem;
    });
    
    res.json(signInWithFixedUrls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateAuthImage = async (req, res) => {
  try {
    const signIn = await AuthImage.findById(req.params.id);
    if (!signIn) return res.status(404).json({ message: "Sign In not found" });

    // Check for Google Drive URLs first
    if (req.body.imageUrl) {
      const imageUrls = Array.isArray(req.body.imageUrl) ? req.body.imageUrl : [req.body.imageUrl];
      signIn.image = imageUrls.map(url => convertGoogleDriveUrl(url));
    } else if (req.files && req.files.image) {
      const newImages = req.files.image.map((file) => file.filename);
      signIn.image = newImages;
    }

    if (req.body.phoneImageUrl) {
      const phoneImageUrls = Array.isArray(req.body.phoneImageUrl) ? req.body.phoneImageUrl : [req.body.phoneImageUrl];
      signIn.phoneImage = phoneImageUrls.map(url => convertGoogleDriveUrl(url));
    } else if (req.files && req.files.phoneImage) {
      const newImages = req.files.phoneImage.map((file) => file.filename);
      signIn.phoneImage = newImages;
    }

    await signIn.save();
    res.json(signIn);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteAuthImage = async (req, res) => {
  try {
    const signIn = await AuthImage.findByIdAndDelete(req.params.id);
    if (!signIn) return res.status(404).json({ message: "Sign In not found" });
    res.json(signIn);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAuthImageUser = async (req, res) => {
  try {
    const signIn = await AuthImage.find();
    if (!signIn || signIn.length === 0) {
      return res.status(404).json({ message: "Sign In not found" });
    }

    // Map through the signIn array and prepend the image path with baseUrl
    const signInWithImageUrls = signIn.map((item) => {
      const updatedItem = item.toObject(); // Convert Mongoose document to plain JS object

      if (updatedItem.image && updatedItem.image.length > 0) {
        updatedItem.image = updatedItem.image.map((image) => {
          // If it's a full URL (Google Drive), fix and return as-is
          if (image.startsWith('http')) {
            return convertGoogleDriveUrl(image);
          }
          return baseUrl + image;
        });
      }
      if (updatedItem.phoneImage && updatedItem.phoneImage.length > 0) {
        updatedItem.phoneImage = updatedItem.phoneImage.map((phoneImage) => {
          // If it's a full URL (Google Drive), fix and return as-is
          if (phoneImage.startsWith('http')) {
            return convertGoogleDriveUrl(phoneImage);
          }
          return baseUrl + phoneImage;
        });
      }
      return updatedItem;
    });

    res.json(signInWithImageUrls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createStateImages = async (req, res) => {
  try {
    let images = [];
    
    // Check for Google Drive URL first
    if (req.body.imageUrl) {
      const imageUrls = Array.isArray(req.body.imageUrl) ? req.body.imageUrl : [req.body.imageUrl];
      images = imageUrls.map(url => convertGoogleDriveUrl(url));
    } else if (req.files && req.files.image) {
      images = req.files.image.map((file) => file.filename);
    }
    
    const signIn = new StateImages({
      stateName: req.body.stateName,
      type: req.body.type,
      image: images,
    });
    await signIn.save();
    res.status(201).json(signIn);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getStateImages = async (req, res) => {
  try {
    const signIn = await StateImages.find();
    if (!signIn) return res.status(404).json({ message: "Sign In not found" });
    
    // Fix URLs for display - convert old Google Drive URLs to new format
    const signInWithFixedUrls = signIn.map((item) => {
      const updatedItem = item.toObject();
      
      if (updatedItem.image && updatedItem.image.length > 0) {
        updatedItem.image = updatedItem.image.map((img) => {
          if (img.startsWith('http')) {
            return convertGoogleDriveUrl(img);
          }
          return img;
        });
      }
      return updatedItem;
    });
    
    res.json(signInWithFixedUrls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateStateImages = async (req, res) => {
  try {
    const { stateName, type } = req.body;
    const signIn = await StateImages.findById(req.params.id);
    if (!signIn) return res.status(404).json({ message: "Sign In not found" });

    // Update stateName and type if provided
    if (stateName) signIn.stateName = stateName;
    if (type) signIn.type = type;

    // Check for Google Drive URL first
    if (req.body.imageUrl) {
      const imageUrls = Array.isArray(req.body.imageUrl) ? req.body.imageUrl : [req.body.imageUrl];
      signIn.image = imageUrls.map(url => convertGoogleDriveUrl(url));
    } else if (req.files && req.files.image) {
      const newImages = req.files.image.map((file) => file.filename);
      signIn.image = newImages;
    }

    await signIn.save();
    res.json(signIn);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteStateImages = async (req, res) => {
  try {
    const signIn = await StateImages.findByIdAndDelete(req.params.id);
    if (!signIn) return res.status(404).json({ message: "Sign In not found" });
    res.json(signIn);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getStateImagesUser = async (req, res) => {
  try {
    const { type } = req.params; // Extract type from the URL params

    // Fetch data based on the type
    const signIn = await StateImages.find({ type });

    if (!signIn || signIn.length === 0) {
      return res
        .status(404)
        .json({ message: "No data found for the provided type" });
    }

    // Map through the signIn array, and only include the 'image' and 'stateName' fields
    const signInWithImageUrls = signIn.map((item) => {
      // Map and prepend the image URLs with baseUrl if they exist, or fix Google Drive URLs
      const formattedItem = {
        stateName: item.stateName,
        image:
          item.image && item.image.length > 0
            ? item.image.map((image) => {
                // If it's a full URL (Google Drive), fix and return as-is
                if (image.startsWith('http')) {
                  return convertGoogleDriveUrl(image);
                }
                return baseUrl + image;
              })
            : [],
      };
      return formattedItem;
    });

    // Wrap the result in a 'data' object
    res.json({ data: signInWithImageUrls });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

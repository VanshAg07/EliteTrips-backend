const OurTeam = require("../../model/Team/OurTeamSchema");
const PaymentImage = require("../../model/PaymentImage/PayementImage");

// Helper function to convert Google Drive URL to lh3 format
const convertGoogleDriveUrl = (url) => {
  if (!url) return url;
  
  // Already in lh3 format
  if (url.includes('lh3.googleusercontent.com')) {
    return url;
  }
  
  // Extract file ID from various Google Drive URL formats
  let fileId = null;
  
  // Format: https://drive.google.com/file/d/FILE_ID/view
  const fileMatch = url.match(/\/file\/d\/([^\/]+)/);
  if (fileMatch) {
    fileId = fileMatch[1];
  }
  
  // Format: https://drive.google.com/open?id=FILE_ID
  const openMatch = url.match(/[?&]id=([^&]+)/);
  if (openMatch) {
    fileId = openMatch[1];
  }
  
  // Format: https://drive.google.com/uc?id=FILE_ID
  const ucMatch = url.match(/uc\?.*id=([^&]+)/);
  if (ucMatch) {
    fileId = ucMatch[1];
  }
  
  if (fileId) {
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  }
  
  return url;
};

exports.createTeamMember = async (req, res) => {
  try {
    let image = [];
    
    // Check for Google Drive URL
    if (req.body.imageUrl) {
      image = [convertGoogleDriveUrl(req.body.imageUrl)];
    }
    // Check if the image file is included in the request
    else if (req.files && req.files.image) {
      if (Array.isArray(req.files.image)) {
        // If multiple images are uploaded, save each filename in an array
        image = req.files.image.map((file) => file.filename);
      } else {
        // If a single image is uploaded, save the filename in an array
        image = [req.files.image.filename];
      }
    }

    // Create a new team member using the data from the request
    const teamMember = new OurTeam({
      name: req.body.name,
      position: req.body.position,
      description: req.body.description,
      linkedIn: req.body.linkedIn,
      instagram: req.body.instagram,
      image: image,  // Save the image filename(s)
    });

    // Save the team member to the database
    await teamMember.save();

    // Send the response with the newly created team member
    res.status(201).json({
      message: "Team member added successfully",
      teamMember,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "An error occurred while adding the team member.",
    });
  }
};


exports.getTeamMember = async (req, res) => {
  try {
    const baseUrl = "https://elitetrips-backend.onrender.com/upload/";

    // Fetch all team members from the database
    const teamMembers = await OurTeam.find();

    // Map the team members data to construct the response
    const responseData = teamMembers.map((teamMember) => {
      // Get the first image from the array
      const imageValue = Array.isArray(teamMember.image) ? teamMember.image[0] : teamMember.image;
      
      // Check if it's a Google Drive URL (starts with http)
      let imageUrl;
      if (imageValue && imageValue.startsWith('http')) {
        imageUrl = convertGoogleDriveUrl(imageValue);
      } else {
        imageUrl = `${baseUrl}${imageValue}`;
      }
      
      return {
        ...teamMember._doc, // Spread the existing team member data
        image: imageUrl, // Construct the image URL
      };
    });

    res.status(200).json({
      message: "Team members retrieved successfully",
      data: responseData,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving team members", error: error.message });
  }
};
// Update an existing team member
exports.updateTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, position, description, instagram, linkedIn } = req.body;

    // Retrieve the existing team member
    const existingTeamMember = await OurTeam.findById(id);
    if (!existingTeamMember) {
      return res.status(404).json({ message: "Team member not found" });
    }

    // Initialize variables for the updated fields
    let image = existingTeamMember.image;

    // Check for Google Drive URL
    if (req.body.imageUrl) {
      image = [convertGoogleDriveUrl(req.body.imageUrl)];
    }
    // Check if new files are provided and update accordingly
    else if (req.files) {
      // Update image if new files are uploaded
      if (req.files.image) {
        if (Array.isArray(req.files.image)) {
          image = req.files.image.map((file) => file.filename); // Multiple images
        } else {
          image = [req.files.image.filename]; // Single image
        }
      }
    }

    // Update the team member details
    const updatedTeamMember = await OurTeam.findByIdAndUpdate(
      id,
      {
        name,
        position,
        image,
        description,
        instagram,
        linkedIn,
      },
      { new: true }
    );

    res.json({
      message: "Team member updated successfully",
      data: updatedTeamMember,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating team member", error: error.message });
  }
};

// Delete a team member
exports.deleteTeamMember = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTeamMember = await OurTeam.findByIdAndDelete(id);

    if (!deletedTeamMember) {
      return res.status(404).json({ message: "Team member not found" });
    }

    res.json({ message: "Team member deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting team member", error: error.message });
  }
};

exports.addPaymentImage = async (req, res) => {
  try {
    let image = [];
    if (req.files) {
      if (req.files.image) {
        if (Array.isArray(req.files.image)) {
          image = req.files.image.map((file) => file.filename);
        } else {
          image.push(req.files.image.filename);
        }
      }
    } else {
      return res.status(400).json({ message: "No image files provided" });
    }

    const newPaymentImage = new PaymentImage({
      image,
    });

    const savedPaymentImage = await newPaymentImage.save();
    res.status(201).json({
      message: "Payment image added successfully",
      data: savedPaymentImage,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding payment image", error: error.message });
  }
};

exports.getPaymentImages = async (req, res) => {
  try {
    const paymentImages = await PaymentImage.find({});
    res.json({
      message: "Payment images retrieved successfully",
      data: paymentImages,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving payment images",
      error: error.message,
    });
  }
};

exports.deletePaymentImage = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPaymentImage = await PaymentImage.findByIdAndDelete(id);

    if (!deletedPaymentImage) {
      return res.status(404).json({ message: "Payment image not found" });
    }

    res.json({ message: "Payment image deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting payment image", error: error.message });
  }
};

exports.updatePaymentImage = async (req, res) => {
  try {
    const { id } = req.params;
    let image = [];
    if (req.files) {
      if (req.files.image) {
        if (Array.isArray(req.files.image)) {
          image = req.files.image.map((file) => file.filename);
        } else {
          image.push(req.files.image.filename);
        }
      }
    } else {
      return res.status(400).json({ message: "No image files provided" });
    }
    const updatedPaymentImage = await PaymentImage.findByIdAndUpdate(
      id,
      { image },
      { new: true }
    );
    res.json({
      message: "Payment image updated successfully",
      data: updatedPaymentImage,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating payment image", error: error.message });
  }
};

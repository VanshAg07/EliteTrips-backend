const Corporate = require("../../model/Corporate/Corporate");
const PartnersCorporate = require("../../model/Corporate/PartnersCorporate");
const HallOfFrame = require("../../model/HallOfFrame");
const PaymentImage = require("../../model/PaymentImage/PayementImage")
const baseUrl = "http://localhost:5001/upload/";

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

exports.addCorporate = async (req, res) => {
  try {
    // Extract data from request body
    const { headingTitle, heading, description } = req.body;

    let image = [];
    if (req.files) {
      // Handling image files
      if (req.files.image) {
        if (Array.isArray(req.files.image)) {
          image = req.files.image.map((file) => file.filename); // Multiple images
        } else {
          image = [req.files.image.filename]; // Single image
        }
      }
    }

    // Parse the 'heading' field, which is expected to be a JSON array
    let parsedHeading = [];
    if (heading) {
      parsedHeading = JSON.parse(heading).map((item) => ({
        title: item.title,
        headingDescription: item.headingDescription,
        subHeading: item.subHeading,
        points: item.points || [], // Ensure points is an array, even if empty
      }));
    }

    // Create a new corporate entity with the provided data
    const corporate = new Corporate({
      headingTitle,
      heading: parsedHeading,
      description,
      image,
    });

    // Save the new corporate entity to the database
    await corporate.save();

    // Return success response
    res.status(201).json({
      message: "Corporate added successfully",
      data: corporate,
    });
  } catch (error) {
    // Handle any errors
    console.error("Error adding corporate:", error);
    res.status(400).json({
      message: "Error adding corporate",
      error: error.message,
    });
  }
};

exports.getCorporateHeading = async (req, res) => {
  try {
    // Fetch all corporate entries from the database
    const corporateData = await Corporate.find();

    // Check if no data is found
    if (!corporateData || corporateData.length === 0) {
      return res.status(404).json({
        message: "No corporate data found",
      });
    }

    // Base URL for images (modify baseUrl based on your configuration)
    const baseUrl = `http://localhost:5001/upload/`;

    // Map over the fetched data to format the response
    const response = corporateData.map((corporate) => ({
      _id: corporate._id,
      headingTitle: corporate.headingTitle,
      heading: corporate.heading.map((item) => ({
        title: item.title,
        headingDescription: item.headingDescription,
        subHeading: item.subHeading,
        points: item.points,
      })),
      description: corporate.description,
      image: corporate.image.map((img) => `${baseUrl}${img}`),
    }));

    // Send the response back to the client
    res.status(200).json({
      message: "Corporate data fetched successfully",
      data: response,
    });
  } catch (error) {
    // Handle any errors
    res.status(500).json({
      message: "Error fetching corporate data",
      error: error.message,
    });
  }
};

exports.updateCorporate = async (req, res) => {
  try {
    // Fetch the corporate entry with the given ID
    const corporate = await Corporate.findById(req.params.id);
    if (!corporate) {
      return res.status(404).json({
        message: "Corporate not found",
      });
    }
    // Extract data from the request body
    const { headingTitle, heading, description } = req.body;
    // Update fields if provided in the request body
    if (headingTitle) corporate.headingTitle = headingTitle;
    if (description) corporate.description = description;
    // Update heading array if provided
    if (heading && Array.isArray(heading)) {
      corporate.heading = heading.map((item) => ({
        title: item.title,
        headingDescription: item.headingDescription,
        subHeading: item.subHeading,
        points: item.points || [],
      }));
    }
    // Handle file updates for images
    if (req.files) {
      // Update image if new files are uploaded
      if (req.files.image) {
        corporate.image = Array.isArray(req.files.image)
          ? req.files.image.map((file) => file.filename)
          : [req.files.image.filename];
      }
    }
    // Save the updated corporate entry to the database
    await corporate.save();
    // Return success response
    res.status(200).json({
      message: "Corporate updated successfully",
      data: corporate,
    });
  } catch (error) {
    // Handle any errors
    res.status(500).json({
      message: "Error updating corporate",
      error: error.message,
    });
  }
};

exports.deleteCorporate = async (req, res) => {
  try {
    // Fetch the corporate entry with the given ID
    const corporate = await Corporate.findByIdAndDelete(req.params.id);
    if (!corporate) {
      return res.status(404).json({
        message: "Corporate not found",
      });
    }

    // Return success response
    res.status(200).json({
      message: "Corporate deleted successfully",
    });
  } catch (error) {
    //
    res.status(500).json({
      message: "Error deleting corporate",
      error: error.message,
    });
  }
};

exports.createPartnersCorporate = async (req, res) => {
  try {
    const { heading, description, place, people, youtubeLink } = req.body;
    let logo = [];
    let image = [];
    if (req.files) {
      if (req.files.logo) {
        if (Array.isArray(req.files.logo)) {
          logo = req.files.logo.map((file) => file.filename); // Multiple images
        } else {
          logo = [req.files.logo.filename]; // Single image
        }
      }
      if (req.files.image) {
        if (Array.isArray(req.files.image)) {
          image = req.files.image.map((file) => file.filename); // Multiple images
        } else {
          image = [req.files.image.filename]; // Single image
        }
      }
    }

    const partnersCorporate = new PartnersCorporate({
      heading,
      description,
      place,
      people,
      logo,
      image,
      youtubeLink,
    });
    await partnersCorporate.save();
    res.status(201).json({
      message: "Partners Added Successfully",
      data: partnersCorporate,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error creating partners corporate",
      error: error.message,
    });
  }
};

exports.getPartnersCorporate = async (req, res) => {
  try {
    const partnersCorporateData = await PartnersCorporate.find();
    const response = partnersCorporateData.map((partnersCorporate) => ({
      _id: partnersCorporate._id,
      heading: partnersCorporate.heading,
      description: partnersCorporate.description,
      place: partnersCorporate.place,
      people: partnersCorporate.people,
      logo: partnersCorporate.logo.map((logo) => `${baseUrl}${logo}`),
      image: partnersCorporate.image.map((image) => `${baseUrl}${image}`),
      youtubeLink: partnersCorporate.youtubeLink,
    }));
    res.status(200).json({
      message: "Partners Corporate data fetched successfully",
      data: response,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching partners corporate data",
      error: error.message,
    });
  }
};

exports.updatePartnersCorporate = async (req, res) => {
  try {
    const partnersCorporate = await PartnersCorporate.findById(req.params.id);
    if (!partnersCorporate) {
      return res.status(404).json({
        message: "Partners Corporate not found",
      });
    }
    const { heading, description, place, people, youtubeLink } = req.body;
    let logo = partnersCorporate.logo;
    let image = partnersCorporate.image;
    if (req.files) {
      if (req.files.logo) {
        if (Array.isArray(req.files.logo)) {
          logo = req.files.logo.map((file) => file.filename); // Multiple images
        } else {
          logo = [req.files.logo.filename]; // Single image
        }
      }
      if (req.files.image) {
        if (Array.isArray(req.files.image)) {
          image = req.files.image.map((file) => file.filename); // Multiple images
        } else {
          image = [req.files.image.filename]; // Single image
        }
      }
    }
    partnersCorporate.heading = heading;
    partnersCorporate.description = description;
    partnersCorporate.place = place;
    partnersCorporate.people = people;
    partnersCorporate.logo = logo;
    partnersCorporate.image = image;
    partnersCorporate.youtubeLink = youtubeLink;
    await partnersCorporate.save();
    res.status(200).json({
      message: "Partners Corporate updated successfully",
      data: partnersCorporate,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error updating partners corporate",
      error: error.message,
    });
  }
};

exports.deletePartnersCorporate = async (req, res) => {
  try {
    const partnersCorporate = await PartnersCorporate.findByIdAndDelete(
      req.params.id
    );
    if (!partnersCorporate) {
      return res.status(404).json({
        message: "Partners Corporate not found",
      });
    }
    res.status(200).json({
      message: "Partners Corporate deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting partners corporate",
      error: error.message,
    });
  }
};

exports.addHallOfFrame = async (req, res) => {
  try {
    let image = [];
    
    // Check for Google Drive URL
    if (req.body.imageUrl) {
      image = [convertGoogleDriveUrl(req.body.imageUrl)];
    }
    // Check for file upload
    else if (req.files) {
      if (req.files.image) {
        if (Array.isArray(req.files.image)) {
          image = req.files.image.map((file) => file.filename); // Multiple images
        } else {
          image = [req.files.image.filename]; // Single image
        }
      }
    }
    
    const hallOfFrame = new HallOfFrame({
      image,
    });
    await hallOfFrame.save();
    res.status(201).json({
      message: "Hall of Frame Added Successfully",
      data: hallOfFrame,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error creating Hall of Frame",
      error: error.message,
    });
  }
};

exports.getHallOfFrame = async (req, res) => {
  try {
    const hallOfFrameData = await HallOfFrame.find();
    const response = hallOfFrameData.map((hallOfFrame) => ({
      _id: hallOfFrame._id,
      image: hallOfFrame.image.map((image) => {
        // Check if it's a Google Drive URL (starts with http)
        if (image && image.startsWith('http')) {
          return convertGoogleDriveUrl(image);
        }
        return `${baseUrl}${image}`;
      }),
    }));
    res.status(200).json({
      message: "Hall of Frame data fetched successfully",
      data: response,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching Hall of Frame data",
      error: error.message,
    });
  }
};

exports.updateHallOfFrame = async (req, res) => {
  try {
    const hallOfFrameId = req.params.id;
    const hallOfFrame = await HallOfFrame.findById(hallOfFrameId);

    if (!hallOfFrame) {
      return res.status(404).json({
        message: "Hall of Frame not found",
      });
    }

    let image = hallOfFrame.image;
    
    // Check for Google Drive URL
    if (req.body.imageUrl) {
      image = [convertGoogleDriveUrl(req.body.imageUrl)];
    }
    // Check for file upload
    else if (req.files) {
      if (req.files.image) {
        if (Array.isArray(req.files.image)) {
          image = req.files.image.map((file) => file.filename); // Multiple images
        } else {
          image = [req.files.image.filename]; // Single image
        }
      }
    }
    
    hallOfFrame.image = image;
    await hallOfFrame.save();

    res.status(200).json({
      message: "Hall of Frame updated successfully",
      data: hallOfFrame,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error updating Hall of Frame",
      error: error.message,
    });
  }
};

exports.deleteHallOfFrame = async (req, res) => {
  try {
    const hallOfFrameId = req.params.id;
    const hallOfFrame = await HallOfFrame.findByIdAndDelete(hallOfFrameId);
    if (!hallOfFrame) {
      return res.status(404).json({
        message: "Hall of Frame not found",
      });
    }
    res.status(200).json({
      message: "Hall of Frame deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting Hall of Frame",
      error: error.message,
    });
  }
};

exports.addPaymentImage = async (req, res) => {
  try {
    let image = [];
    if (req.files && req.files.image) {
      image = Array.isArray(req.files.image)
        ? req.files.image.map((file) => file.filename) // Multiple images
        : [req.files.image.filename]; // Single image
    }

    const paymentImage = new PaymentImage({
      image,
      status: req.body.status || "non-active", // Default to "non-active" if not provided
    });

    await paymentImage.save();

    res.status(201).json({
      message: "Payment Image Added Successfully",
      data: paymentImage,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error creating Payment Image",
      error: error.message,
    });
  }
};

exports.getPaymentImage = async (req, res) => {
  try {
    const paymentImageData = await PaymentImage.find();
    const response = paymentImageData.map((paymentImage) => ({
      _id: paymentImage._id,
      image: paymentImage.image.map((img) => `${baseUrl}${img}`), // Convert to URL
      status: paymentImage.status,
    }));

    res.status(200).json({
      message: "Payment Image data fetched successfully",
      data: response,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching Payment Image data",
      error: error.message,
    });
  }
};

exports.updatePaymentImage = async (req, res) => {
  try {
    const paymentImageId = req.params.id;
    const paymentImage = await PaymentImage.findById(paymentImageId);

    if (!paymentImage) {
      return res.status(404).json({
        message: "Payment Image not found",
      });
    }

    // Update the status if provided
    if (req.body.status) {
      paymentImage.status = req.body.status;
    }

    // Handle image updates
    if (req.files && req.files.image) {
      paymentImage.image = Array.isArray(req.files.image)
        ? req.files.image.map((file) => file.filename) // Multiple images
        : [req.files.image.filename]; // Single image
    }

    await paymentImage.save();

    res.status(200).json({
      message: "Payment Image updated successfully",
      data: paymentImage,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error updating Payment Image",
      error: error.message,
    });
  }
};

exports.deletePaymentImage = async (req, res) => {
  try {
    const paymentImageId = req.params.id;
    const paymentImage = await PaymentImage.findByIdAndDelete(paymentImageId);

    if (!paymentImage) {
      return res.status(404).json({
        message: "Payment Image not found",
      });
    }

    res.status(200).json({
      message: "Payment Image deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting Payment Image",
      error: error.message,
    });
  }
};

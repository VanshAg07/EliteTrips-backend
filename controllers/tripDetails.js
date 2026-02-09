const BestActivity = require("../model/bestActivities");
const BeautifulPlaces = require("../model/bestPlaces");
const RichFlavour = require("../model/richFlavour");
const Shop = require("../model/shop");

const addActivity = async (req, res) => {
  try {
    const activityData = req.body;
    if (req.files && req.files.img && req.files.img.length > 0) {
      const imgFile = req.files.img[0];
      activityData.img = imgFile.filename;
    }
    const activity = new BestActivity(activityData);
    await activity.save();
    res.status(201).json(activity);
  } catch (error) {
    console.error("Error adding activity:", error);
    res.status(400).json({ error: error.message });
  }
};

const editActivity = async (req, res) => {
  try {
    const { id } = req.params; // Assuming the activity ID is passed as a route parameter
    const updatedData = req.body;

    // editActivityCheck if a new image is provided
    if (req.files && req.files.img && req.files.img.length > 0) {
      const imgFile = req.files.img[0];
      updatedData.img = imgFile.filename;
    }

    const activity = await BestActivity.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }

    res.status(200).json(activity);
  } catch (error) {
    console.error("Error editing activity:", error);
    res.status(400).json({ error: error.message });
  }
};

const getBestActivities = async (req, res) => {
  try {
    const activities = await BestActivity.find();
    res.status(200).json(activities);
  } catch (error) {
    console.error("Error fetching activities:", error);
  }
};

const getBestActivitiesById = async (req, res) => {
  try {
    const { id } = req.params;
    const activity = await BestActivity.findById(id);
    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }
    res.status(200).json(activity);
  } catch (error) {
    console.error("Error fetching activity by ID:", error);
    res.status(400).json({ error: error.message });
  }
};
const deleteBestActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const activity = await BestActivity.findByIdAndDelete(id);
    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }
    res.status(200).json({ message: "Activity deleted successfully" });
  } catch (error) {
    console.error("Error deleting activity:", error);
    res.status(400).json({ error: error.message });
  }
};

const addBeautifulPlaces = async (req, res) => {
  try {
    const { stateName, location, title, description } = req.body;
    const activityData = {
      stateName,
      location,
      title,
      description,
      img: imgFile.filename,
    };
    const activity = new BeautifulPlaces(activityData);
    await activity.save();
    res.status(201).json(activity);
  } catch (error) {
    console.error("Error adding place:", error);
    res.status(500).json({ error: error.message });
  }
};

const getBeautifulPlaces = async (req, res) => {
  try {
    const activities = await BeautifulPlaces.find();
    res.status(200).json(activities);
  } catch (error) {
    console.error("Error fetching activities:", error);
  }
};
const getBeautifulPlacesById = async (req, res) => {
  try {
    const { id } = req.params;
    const activity = await BeautifulPlaces.findById(id);
    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }
    res.status(200).json(activity);
  } catch (error) {
    console.error("Error fetching activity by ID:", error);
    res.status(400).json({ error: error.message });
  }
};

const editBeautifulPlaces = async (req, res) => {
  try {
    const { id } = req.params; // Assuming the activity ID is passed as a route parameter
    const updatedData = req.body;

    // editActivityCheck if a new image is provided
    if (req.files && req.files.img && req.files.img.length > 0) {
      const imgFile = req.files.img[0];
      updatedData.img = imgFile.filename;
    }

    const activity = await BeautifulPlaces.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }

    res.status(200).json(activity);
  } catch (error) {
    console.error("Error editing activity:", error);
    res.status(400).json({ error: error.message });
  }
};

const deleteBeautifulPlaces = async (req, res) => {
  try {
    const { id } = req.params;
    const activity = await BeautifulPlaces.findByIdAndDelete(id);
    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }
    res.status(200).json({ message: "Activity deleted successfully" });
  } catch (error) {
    console.error("Error deleting activity:", error);
    res.status(400).json({ error: error.message });
  }
};

const addRichFlavour = async (req, res) => {
  try {
    const flavourData = req.body;
    if (req.files && req.files.img && req.files.img.length > 0) {
      const imgFile = req.files.img[0];
      flavourData.img = imgFile.filename;
    }
    const flavour = new RichFlavour(flavourData);
    await flavour.save();
    res.status(201).json(flavour);
  } catch (error) {
    console.error("Error adding rich flavour:", error);
    res.status(400).json({ error: error.message });
  }
};

const getFlavour = async (req, res) => {
  try {
    const activities = await RichFlavour.find();
    res.status(200).json(activities);
  } catch (error) {
    console.error("Error fetching activities:", error);
  }
};

const getRichFlavourById = async (req, res) => {
  try {
    const { id } = req.params;
    const activity = await RichFlavour.findById(id);
    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }
    res.status(200).json(activity);
  } catch (error) {
    console.error("Error fetching activity by ID:", error);
    res.status(400).json({ error: error.message });
  }
};

const editRichFlavour = async (req, res) => {
  try {
    const { id } = req.params; // Assuming the activity ID is passed as a route parameter
    const updatedData = req.body;

    // editActivityCheck if a new image is provided
    if (req.files && req.files.img && req.files.img.length > 0) {
      const imgFile = req.files.img[0];
      updatedData.img = imgFile.filename;
    }

    const activity = await RichFlavour.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }

    res.status(200).json(activity);
  } catch (error) {
    console.error("Error editing activity:", error);
    res.status(400).json({ error: error.message });
  }
};

const deleteRichFlavour = async (req, res) => {
  try {
    const { id } = req.params;
    const activity = await RichFlavour.findByIdAndDelete(id);
    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }
    res.status(200).json({ message: "Activity deleted successfully" });
  } catch (error) {
    console.error("Error deleting activity:", error);
    res.status(400).json({ error: error.message });
  }
};
const addShop = async (req, res) => {
  try {
    const shopData = req.body;
    if (req.files && req.files.img && req.files.img.length > 0) {
      const imgFile = req.files.img[0];
      shopData.img = imgFile.filename;
    }
    const shop = new Shop(shopData);
    await shop.save();
    res.status(201).json(shop);
  } catch (error) {
    console.error("Error adding shop:", error);
    res.status(400).json({ error: error.message });
  }
};

const getShop = async (req, res) => {
  try {
    const activities = await Shop.find();
    res.status(200).json(activities);
  } catch (error) {
    console.error("Error fetching activities:", error);
  }
};

const getShopsById = async (req, res) => {
  try {
    const { id } = req.params;
    const activity = await Shop.findById(id);
    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }
    res.status(200).json(activity);
  } catch (error) {
    console.error("Error fetching activity by ID:", error);
    res.status(400).json({ error: error.message });
  }
};

const editShop = async (req, res) => {
  try {
    const { id } = req.params; // Assuming the activity ID is passed as a route parameter
    const updatedData = req.body;

    // editActivityCheck if a new image is provided
    if (req.files && req.files.img && req.files.img.length > 0) {
      const imgFile = req.files.img[0];
      updatedData.img = imgFile.filename;
    }

    const activity = await Shop.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }

    res.status(200).json(activity);
  } catch (error) {
    console.error("Error editing activity:", error);
    res.status(400).json({ error: error.message });
  }
};

const deleteShop = async (req, res) => {
  try {
    const { id } = req.params;
    const activity = await Shop.findByIdAndDelete(id);
    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }
    res.status(200).json({ message: "Activity deleted successfully" });
  } catch (error) {
    console.error("Error deleting activity:", error);
    res.status(400).json({ error: error.message });
  }
};
module.exports = {
  addActivity,
  addBeautifulPlaces,
  addRichFlavour,
  addShop,
  editActivity,
  getBestActivities,
  getBestActivitiesById,
  getShop,
  getShopsById,
  editShop,
  editRichFlavour,
  getRichFlavourById,
  getFlavour,
  editBeautifulPlaces,
  getBeautifulPlacesById,
  getBeautifulPlaces,
  deleteBestActivity,
  deleteBeautifulPlaces,
  deleteRichFlavour,
  deleteShop,
};

const Reviews = require("../../model/Reviews/Reviews");

exports.addReview = async (req, res) => {
  try {
    const review = new Reviews(req.body);
    await review.save();
    res.status(201).json({ message: "Review added successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const reviews = await Reviews.find();
    res.json(reviews);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const updatedReview = await Reviews.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedReview)
      return res.status(404).json({ message: "Review not found" });
    res.json(updatedReview);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const deletedReview = await Reviews.findByIdAndDelete(req.params.id);
    if (!deletedReview)
      return res.status(404).json({ message: "Review not found" });
    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

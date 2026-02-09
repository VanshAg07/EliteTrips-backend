const express = require("express");
const router = express.Router();
const FlipController = require("../../controllers/FlipCard/Flipcard");
const upload = require("../../config/uploads");

router.post(
  "/flip",
  upload.fields([{ name: "flipcardImage", maxCount: 1 }]),
  FlipController.addFlipcardToCategory
);

router.get("/flip", FlipController.getFlipcards);

router.put(
  "/flip/:category/:flipcardId",
  upload.fields([{ name: "flipcardImage", maxCount: 1 }]),
  FlipController.updateFlipcardInCategory
);

router.delete("/flip", FlipController.deleteFlipcardInCategory);

module.exports = router;

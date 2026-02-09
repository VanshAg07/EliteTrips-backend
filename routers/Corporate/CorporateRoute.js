const express = require("express");
const router = express.Router();
const upload = require("../../config/uploads");
const CorporateController = require("../../controllers/Corporate/CorporateController");

// route to create the corporate landing page
router.post(
  "/create-corporate-landing",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "headingImage", maxCount: 1 },
  ]),
  CorporateController.addCorporate
);

// route to get the corporate image
router.get(
  "/create-corporate-landing",
  CorporateController.getCorporateHeading
);

// route to update the corporate image
router.put(
  "/update-corporate-landing/:id",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "headingImage", maxCount: 1 },
  ]),
  CorporateController.updateCorporate
);

// route to delete the corporate image
router.delete(
  "/delete-corporate-landing/:id",
  CorporateController.deleteCorporate
);

// route to create the partners corporate section
router.post(
  "/partners-create",
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  CorporateController.createPartnersCorporate
);

// route to get the partners corporate section
router.get("/partners-get", CorporateController.getPartnersCorporate);

// route to update the partners corporate section
router.put(
  "/partners-update/:id",
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  CorporateController.updatePartnersCorporate
);

// route to delete the partners corporate section
router.delete(
  "/partners-delete/:id",
  CorporateController.deletePartnersCorporate
);

router.post(
  "/hall-of-frame",
  upload.fields([{ name: "image", maxCount: 1 }]),
  CorporateController.addHallOfFrame
);

router.get("/hall-of-frame", CorporateController.getHallOfFrame);

router.put(
  "/hall-of-frame/:id",
  upload.fields([{ name: "image", maxCount: 1 }]),
  CorporateController.updateHallOfFrame
);

router.delete("/hall-of-frame/:id", CorporateController.deleteHallOfFrame);

router.post(
  "/payment-image",
  upload.fields([{ name: "image", maxCount: 1 }]),
  CorporateController.addPaymentImage
);

router.get("/payment-image", CorporateController.getPaymentImage);

router.put(
  "/payment-image/:id",
  upload.fields([{ name: "image", maxCount: 1 }]),
  CorporateController.updatePaymentImage
);

router.delete("/payment-image/:id", CorporateController.deletePaymentImage);

module.exports = router;

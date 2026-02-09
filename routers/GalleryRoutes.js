const express = require("express");
const router = express.Router();
const GalleryControllers = require("../controllers/GalleryControllers");
const upload = require("../config/uploads");

router.post(
  "/add-honeymoon-gallery",
  upload.fields([{ name: "tripImages", maxCount: 25 }]),
  GalleryControllers.addGalleryHoneymoon
);

router.get("/honeymoon-galleries", GalleryControllers.getHoneymoonGallery);

router.post(
  "/national-gallery",
  upload.fields([{ name: "tripImages", maxCount: 25 }]),
  GalleryControllers.addGalleryNational
);

router.get("/national-galleries", GalleryControllers.getNationalGallery);

router.post(
  "/international-gallery",
  upload.fields([{ name: "tripImages", maxCount: 25 }]),
  GalleryControllers.addGalleryInternational
);

router.get(
  "/international-galleries",
  GalleryControllers.getInternationalGallery
);

router.post(
  "/home-gallery",
  upload.fields([{ name: "images", maxCount: 125 }]),

  GalleryControllers.addGalleryHome
);
router.post(
  "/home-gallery/:id",
  upload.fields([{ name: "images", maxCount: 25 }]),

  GalleryControllers.addGalleryHome
);

router.get("/home-galleries", GalleryControllers.getHomeGallery);

router.delete("/home-gallery/:id", GalleryControllers.deleteHomeGallery);

router.delete("/home-gallery/:galleryId/image/:imageName",GalleryControllers.deleteGalleryImage)

module.exports = router;
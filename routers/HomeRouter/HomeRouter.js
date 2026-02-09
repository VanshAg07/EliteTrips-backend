const express = require("express");
const router = express.Router();
const upload = require("../../config/uploads");
const HomeController = require("../../controllers/HomeController/HomeController");
const TeamController = require("../../controllers/TeamController/teamController");
const PayementImage = require("../../controllers/TeamController/teamController");
const SearchController = require("../../controllers/SearchControler");

router.get("/search", SearchController.getSearchController);
router.get("/upcoming", SearchController.getUpcomingTripsController);
router.get("/get-national-nav", HomeController.getAllStatesNational);
router.get("/get-international-nav", HomeController.getAllStatesInternNational);
router.get("/get-honeymoon-nav", HomeController.getAllStatesHoneymoon);

// create the video images route
router.post(
  "/video-page",
  upload.fields([
    { name: "backgroundVideo", maxCount: 1 },
    { name: "backgroundImage", maxCount: 1 },
  ]),
  HomeController.addVideoPage
);

// route to get the video image controller for the homescreen
router.get("/video-page", HomeController.getAllVideoPages);

// route to get the video image by its id
router.get("/video-page/:id", HomeController.getVideoPageById);

// route to update the video page as image and video
router.put(
  "/video-page/:id",
  upload.fields([{ name: "backgroundVideo", maxCount: 1 }]),
  HomeController.updateVideoPage
);

// route to delete the video images controller of the homescreen
router.delete("/video-page/:id", HomeController.deleteVideoPage);

// route to create the footer-icons
router.post(
  "/footer-icons",
  upload.fields([{ name: "iconImage", maxCount: 1 }]),
  HomeController.addFooterIcon
);

// route to get the footer-icons controller for the homescreen
router.get("/footer-icons", HomeController.getFooterIcons);

// route to get the footer-icons by id
router.get("/footer-icons/:id", HomeController.getFooterIconById);

// route to update the footer-icons as image
router.put(
  "/footer-icons/:id",
  upload.fields([{ name: "iconImage", maxCount: 1 }]),
  HomeController.updateFooterIcon
);

// route to delete the footer-icons controller of the homescreen
router.delete("/footer-icons/:id", HomeController.deleteFooterIcon);

// route to create the team member
router.post(
  "/add-team-member",
  upload.fields([
    { name: "image", maxCount: 1 }, // Handle only 1 file for 'image'
  ]),
  TeamController.createTeamMember
);

router.get("/get-team-member", TeamController.getTeamMember);

// route to update the team member
router.put(
  "/add-team-member/:id",
  upload.fields([{ name: "image", maxCount: 1 }]),
  TeamController.updateTeamMember
);

// route to update the team member
router.delete("/add-team-member/:id", TeamController.deleteTeamMember);

// route to create the payment images
router.post(
  "/add-payment-image",
  upload.fields([{ name: "image" }]),
  PayementImage.addPaymentImage
);

// route to get the payment images
router.get("/payment-images", PayementImage.getPaymentImages);

// route to delete the payment images
router.delete("/payment-images/:id", PayementImage.deletePaymentImage);

// route to update the payment images
router.put(
  "/payment-images/:id",
  upload.fields([{ name: "image", maxCount: 1 }]),
  PayementImage.deletePaymentImage
);

// route to create the homepage video
router.post(
  "/create-home-page-video",
  upload.fields([{ name: "video", maxCount: 1 }]),
  HomeController.addHomeVideo
);

// route to get the homepage video
router.get("/home-page-video", HomeController.getHomeVideo);

// route to delete the homepage video
router.delete("/home-page-video/:id", HomeController.deleteHomeVideo);

// route to update the homepage video
router.put(
  "/home-page-video/:id",
  upload.fields([{ name: "video", maxCount: 1 }]),
  HomeController.updateHomeVideo
);

// ==================== HERO IMAGE ROUTES ====================
// route to create/update hero image
router.post("/hero-image", HomeController.createHeroImage);

// route to get hero image
router.get("/hero-image", HomeController.getHeroImage);

// route to delete hero image
router.delete("/hero-image", HomeController.deleteHeroImage);

// route to add the offer to the homepage
router.post(
  "/add-home-offer",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "phoneImage", maxCount: 1 },
  ]),
  HomeController.addOfferHome
);

// route to get all the offers from the homepage
router.get("/home-offers", HomeController.getOfferHome);
router.get("/home-offer-display", HomeController.getOfferHomeDisplay);

// route to delete an offer from the homepage
router.delete("/home-offers/:id", HomeController.deleteOfferHome);

// route to update an offer from the homepage
router.put(
  "/home-offers/:id",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "phoneImage", maxCount: 1 },
  ]),
  HomeController.updateOfferHomeStatus
);
 
// route to add the homepage banner
router.post(
  "/homepage-banner",
  upload.fields([{ name: "image", maxCount: 1 }]),
  HomeController.addHomeBanner
);

// route to get the homepage banner
router.get("/homepage-banner", HomeController.getHomeBanner);

// route to delete the homepage banner
router.delete("/homepage-banner/:id", HomeController.deleteHomeBanner);

// route to update the homepage banner
router.put("/homepage-banner/:id", 
  upload.fields([{ name: "image", maxCount: 1 }]),
  HomeController.updateHomeBanner);

// route to add the homepage international
router.post(
  "/homepage-international",
  upload.fields([{ name: "image", maxCount: 1 }]),
  HomeController.addHomeInternational
);

// route to get the homepage international
router.get("/homepage-international", HomeController.getHomeInternational);

// route to delete the homepage international
router.delete(
  "/homepage-international/:id",
  HomeController.deleteHomeInternational
);

// route to update the homepage international
router.put(
  "/homepage-international/:id",
  upload.fields([{ name: "image", maxCount: 1 }]),
  HomeController.updateHomeInternational
);

// route to add the homepage National
router.post("/homepage-national", HomeController.addHomeNational);

// route to get the homepage National
router.get("/homepage-national", HomeController.getHomeNational);

// route to get the homepage National
router.get(
  "/homepage-choosen-national",
  HomeController.getHomeNationalChosenPackage
);

// route to get the homepage National
router.get(
  "/homepage-choosen-international",
  HomeController.getHomeInternationalChosenPackage
);
// route to get the homepage international
router.get(
  "/homepage-choosen-international-display",
  HomeController.getHomeInternationalChosenPackageDisplay
);
// route to get the homepage National
router.get(
  "/homepage-choosen-national-display",
  HomeController.getHomeNationalChosenPackageDisplay
);
router.get(
  "/homepage-choosen-honeymoon-display",
  HomeController.getHomeHoneymoonChosenPackageDisplay
);
// route to get the homepage National
router.get(
  "/homepage-choosen-honeymoon",
  HomeController.getHomeHoneymoonChosenPackage
);

// route to delete the homepage National
router.delete("/homepage-national/:id", HomeController.deleteHomeNational);

// route to update the homepage Honeymoon
router.put(
  "/homepage-honeymoon/:id",
  upload.fields([{ name: "image", maxCount: 1 }]),
  HomeController.updateHomeHoneymoon
);

// route to add the homepage Honeymoon
router.post(
  "/homepage-honeymoon",
  upload.fields([{ name: "image", maxCount: 1 }]),
  HomeController.addHomeHoneymoon
);

// route to get the homepage Honeymoon
router.get("/homepage-honeymoon", HomeController.getHomeHoneymoon);

// route to delete the homepage Honeymoon
router.delete("/homepage-honeymoon/:id", HomeController.deleteHomeHoneymoon);

// route to update the homepage Honeymoon
router.put(
  "/homepage-Honeymoon/:id",
  upload.fields([{ name: "image", maxCount: 1 }]),
  HomeController.updateHomeNational
);

// route to add the nav offer
router.post("/nav-offer", HomeController.addNavOffer);

// route to get the nav offer
router.get("/nav-offer", HomeController.getNavOffer);

// route to delete the nav offer
router.delete("/nav-offer/:id", HomeController.deleteNavOffer);

// route to update the nav offer
router.put("/nav-offer/:id", HomeController.updateNavOffer);

router.post(
  "/explore-adventure",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  HomeController.addExploreAdventure
);

router.get("/explore-adventure", HomeController.getExploreAdventure);

router.delete("/explore-adventure/:id", HomeController.deleteExploreAdventure);

router.put(
  "/explore-adventure/:id",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  HomeController.updateExploreAdventure
);

router.post("/youtube", HomeController.createVideo);

router.get("/youtube", HomeController.getAllVideos);

router.delete("/youtube/:id", HomeController.deleteVideo);

router.put("/youtube/:id", HomeController.updateVideo);

router.post(
  "/galley-page",
  upload.fields([{ name: "images", maxCount: 5000 }]),
  HomeController.GalleryPage
);

router.get("/galley-page", HomeController.getGalleryPage);

router.delete("/galley-page/:id", HomeController.deleteGalleryPage);

router.put("/galley-page/:id", HomeController.addGalleryPage);

module.exports = router;

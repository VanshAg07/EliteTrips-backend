const express = require("express");
const router = express.Router();
const PopUp = require("../controllers/Popus/Popup");
const upload = require("../config/uploads");

router.post(
  "/signin",
  upload.fields([{ name: "image", maxCount: 1 }]),
  PopUp.createSignIn
);

router.get("/signin", PopUp.getSignIn);

router.get("/signin-user", PopUp.getSignInUser);

router.put(
  "/signin/:id",
  upload.fields([{ name: "image", maxCount: 1 }]),
  PopUp.updateSignIn
);

router.delete("/signin/:id", PopUp.deleteSignIn);

router.post(
  "/state-images",
  upload.fields([{ name: "image", maxCount: 1 }]),
  PopUp.createStateImages
);

router.get("/state-images", PopUp.getStateImages);

router.get("/state-images-user/:type", PopUp.getStateImagesUser);

router.put(
  "/state-images/:id",
  upload.fields([{ name: "image", maxCount: 1 }]),
  PopUp.updateStateImages
);

router.delete("/state-images/:id", PopUp.deleteStateImages);

router.post(
  "/auth-image",
  upload.fields([
    { name: "image", maxCount: 5 },
    { name: "phoneImage", maxCount: 5 },
  ]),
  PopUp.createAuthImage
);

router.get("/auth-image", PopUp.getAuthImage);

router.get("/auth-image-user", PopUp.getAuthImageUser);

router.put(
  "/auth-image/:id",
  upload.fields([
    { name: "image", maxCount: 5 },
    { name: "phoneImage", maxCount: 5 },
  ]),
  PopUp.updateAuthImage
);

router.delete("/auth-image/:id", PopUp.deleteAuthImage);

router.post(
  "/havent",
  upload.fields([{ name: "image", maxCount: 1 }]),
  PopUp.createHavent
);

router.get("/havent", PopUp.getHavent);

router.get("/havent-user", PopUp.getHaventUser);

router.put(
  "/havent/:id",
  upload.fields([{ name: "image", maxCount: 1 }]),
  PopUp.updateHavent
);

router.delete("/havent/:id", PopUp.deleteHavent);

router.post(
  "/assist",
  upload.fields([{ name: "image", maxCount: 1 }]),
  PopUp.createAssist
);

router.get("/assist", PopUp.getAssist);

router.get("/assist-user", PopUp.getAssistUser);

router.put(
  "/assist/:id",
  upload.fields([{ name: "image", maxCount: 1 }]),
  PopUp.updateAssist
);

router.delete("/assist/:id", PopUp.deleteAssist);

router.post("/assist-form", PopUp.createAssistForm);

router.get("/assist-form", PopUp.getAssistForm);

module.exports = router;

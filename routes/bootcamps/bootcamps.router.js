const express = require("express");
const {
  httpGetAllBootcamps,
  httpGetBootcamp,
  httpCreateBootcamp,
  httpUpdateBootcamp,
  httpDeleteBootcamp,
  httpGetBootcampsInRadius,
  httpBootcampPhotoUp,
} = require("./bootcamps.controller");

const bootcampsRouter = express.Router();

bootcampsRouter.get("/", httpGetAllBootcamps);
bootcampsRouter.post("/", httpCreateBootcamp);

bootcampsRouter.get("/:id", httpGetBootcamp);
bootcampsRouter.put("/:id", httpUpdateBootcamp);
bootcampsRouter.delete("/:id", httpDeleteBootcamp);

bootcampsRouter.put("/:id/photo", httpBootcampPhotoUp);
bootcampsRouter.get("/radius/:zipcode/:distance", httpGetBootcampsInRadius);

module.exports = bootcampsRouter;

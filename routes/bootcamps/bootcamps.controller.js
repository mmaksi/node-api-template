const {
  getAllBootcamps,
  getBootcampById,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
} = require("../../models/Bootcamp.model");
const asyncHandler = require("../../utils/asyncHandler");
const bootcampsDatabase = require("../../models/Bootcamp.mongo");
const ErrorResponse = require("../../utils/errorResponse");
const path = require("path");

/**
 * Desc {Get all bootcamps}
 * Route {GET /api/v1/bootcamps}
 * Access {Public}
 */
const httpGetAllBootcamps = asyncHandler(async (req, res) => {
  return res.status(200).json(res.advancedResults);
});

/**
 *  Desc {Get single bootcamp}
 *  Route {GET /api/v1/bootcamps/:id}
 *  Access {Public}
 */
const httpGetBootcamp = asyncHandler(async (req, res) => {
  const bootcamp = await getBootcampById(req.params.id);
  if (!bootcamp) return res.status(404).json({ success: false, data: null });
  return res.status(200).json({ success: true, data: bootcamp });
});

/**
 *  Desc {Create new bootcamp}
 *  Route {POST /api/v1/bootcamps}
 *  Access {Private}
 */
const httpCreateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = req.body;
  // Add user to the bootcamp object
  bootcamp.user = req.user.id;

  // Check for published bootcamp
  const publishedBootcamp = await bootcampsDatabase.findOne({
    user: req.user.id,
  });

  // Restrict creating multiple bootcamps to admins only, and one bootcamp to each publisher
  if (publishedBootcamp && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User with ID ${req.user.id} already published a bootcamp`,
        400
      )
    );
  } else {
    const response = await createBootcamp(bootcamp);
    res.status(201).json({ success: true, data: response });
  }
});

/**
 *  Desc {Update a bootcamp}
 *  Route {PUT /api/v1/bootcamps}
 *  Access {Private}
 */
const httpUpdateBootcamp = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const foundBootcamp = await getBootcampById(id);

  // Check if requested bootcamp exists
  if (!foundBootcamp) {
    return next(new ErrorResponse(`This bootcamps is not found`, 404));
  } else {
    const isNotBootcampOwner =
      // Make sure user is bootcamp owner
      foundBootcamp.user.toString() !== req.user.id &&
      req.user.role !== "admin";
    if (isNotBootcampOwner) {
      return next(
        new ErrorResponse(`User is not authorized to update this bootcamp`, 401)
      );
    } else {
      const updatedBootcamp = await updateBootcamp(id, req.body);
      return res.status(200).json({ success: true, data: updatedBootcamp });
    }
  }
});

/**
 *  Desc {Delete a bootcamp}
 *  Route {DELETE /api/v1/bootcamps}
 *  Access {Private}
 */
const httpDeleteBootcamp = asyncHandler(async (req, res, next) => {
  const foundBootcamp = await getBootcampById(req.params.id);

  // Check if requested bootcamp exists
  if (!foundBootcamp) {
    return next(new ErrorResponse(`This bootcamps is not found`, 404));
  } else {
    // Make sure user is bootcamp owner
    const isNotBootcampOwner =
      foundBootcamp.user.toString() !== req.user.id &&
      req.user.role !== "admin";
    if (isNotBootcampOwner) {
      return next(
        new ErrorResponse(`User is not authorized to delete this bootcamp`, 401)
      );
    } else {
      await deleteBootcamp(req.params.id);
      return res.status(200).json({ success: true, data: {} });
    }
  }
});

// @desc      Get bootcamps within a radius
// @route     GET /v1/bootcamps/radius/:zipcode/:distance
// @access    Public
const httpGetBootcampsInRadius = asyncHandler(async (req, res) => {
  const { zipcode, distance } = req.params;
  const bootcamps = await getBootcampsInRadius(zipcode, distance);
  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});

// @desc      Upload photo for bootcamp
// @route     PUT /api/v1/bootcamps/:id/photo
// @access    Private
const httpUploadPhoto = asyncHandler(async (req, res, next) => {
  const foundBootcamp = await getBootcampById(req.params.id);

  // Check if requested bootcamp exists
  if (!foundBootcamp) {
    return next(new ErrorResponse(`This bootcamps is not found`, 404));
  } else {
    // Make sure user is bootcamp owner
    const isNotBootcampOwner =
      foundBootcamp.user.toString() !== req.user.id &&
      req.user.role !== "admin";
    if (isNotBootcampOwner) {
      return next(
        new ErrorResponse(`User is not authorized to delete this bootcamp`, 401)
      );
    } else {
      // Check for uploaded files
      if (!req.files) {
        return next(new ErrorResponse(`Please upload a file`, 400));
      }
      const file = req.files.file;
      // Make sure the file is a photo
      if (!file.mimetype.startsWith("image")) {
        return next(new ErrorResponse(`Please upload an image file`, 400));
      }
      // Check filesize
      if (file.size > 1000000) {
        return next(
          new ErrorResponse(`Please upload an image less than ${1000000}`, 400)
        );
      }
      // Create custom filename and save it in a static folder
      file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
      file.mv(`./public/uploads/${file.name}`, async (err) => {
        if (err) {
          console.error(err);
          return next(new ErrorResponse(`Problem with file upload`, 500));
        }
        // Save image name in the database
        await bootcampsDatabase.findByIdAndUpdate(req.params.id, {
          photo: file.name,
        });

        return res.status(200).json({
          success: true,
          data: file.name,
        });
      });
    }
  }
});

module.exports = {
  httpGetAllBootcamps,
  httpGetBootcamp,
  httpCreateBootcamp,
  httpUpdateBootcamp,
  httpDeleteBootcamp,
  httpGetBootcampsInRadius,
  httpUploadPhoto,
};

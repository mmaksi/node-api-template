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
  let query;
  const reqQuery = { ...req.query };

  // Fields to exclude from query parameters
  const removeFields = ["select", "sort", "page", "limit"];
  removeFields.forEach((param) => delete reqQuery[param]);
  let queryStr = JSON.stringify(reqQuery);

  // Filter options
  const selectedFields = req.query.select
    ? req.query.select.split(",").join(" ")
    : "";

  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  // Finding resource with optional filters
  query = await bootcampsDatabase
    .find(JSON.parse(queryStr))
    .select(selectedFields)
    .skip(startIndex)
    .limit(limit)
    .populate("courses");

  const totalDocuments = await bootcampsDatabase.countDocuments();

  // if (populate) {
  //   query = query.populate(populate);
  // }

  // Executing query
  const results = query;

  // Pagination result
  const pagination = {};

  if (endIndex < totalDocuments) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  const bootcamps = await getAllBootcamps();
  res.status(200).json({ success: true, count: bootcamps.length, data: query });
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
const httpCreateBootcamp = asyncHandler(async (req, res) => {
  const bootcamp = req.body;
  const response = await createBootcamp(bootcamp);
  res.status(200).json({ success: true, data: response });
});

/**
 *  Desc {Update a bootcamp}
 *  Route {PUT /api/v1/bootcamps}
 *  Access {Private}
 */
const httpUpdateBootcamp = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const bootcamp = req.body;

  const updatedBootcamp = await updateBootcamp(id, bootcamp);
  if (!updatedBootcamp)
    return res.status(404).json({ success: false, data: null });
  return res.status(200).json({ success: true, data: updatedBootcamp });
});

/**
 *  Desc {Delete a bootcamp}
 *  Route {DELETE /api/v1/bootcamps}
 *  Access {Private}
 */
const httpDeleteBootcamp = asyncHandler(async (req, res) => {
  const deletedBootcamp = await deleteBootcamp(req.params.id);

  if (!deletedBootcamp)
    return res.status(404).json({ success: false, data: null });
  return res.status(200).json({ success: true, data: deletedBootcamp });
});

// @desc      Get bootcamps within a radius
// @route     GET /v1/bootcamps/radius/:zipcode/:distance
// @access    Private
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
  const bootcamp = await getBootcampById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is bootcamp owner
  // if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
  //   return next(
  //     new ErrorResponse(
  //       `User ${req.user.id} is not authorized to update this bootcamp`,
  //       401
  //     )
  //   );
  // }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.file;

  // Make sure the image is a photo
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  // Check filesize
  if (file.size > 1000000) {
    return next(
      new ErrorResponse(`Please upload an image less than ${1000000}`, 400)
    );
  }

  // Create custom filename
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

  file.mv(`./public/uploads/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    await bootcampsDatabase.findByIdAndUpdate(req.params.id, {
      photo: file.name,
    });

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
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

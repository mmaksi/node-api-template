const {
  getAllBootcamps,
  getBootcampById,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
} = require("../../models/Bootcamp.model");
const asyncHandler = require("../../utils/asyncHandler");
const bootcampsDatabas = require("../../models/Bootcamp.mongo");

/**
 * Desc {Get all bootcamps}
 * Route {GET /api/v1/bootcamps}
 * Access {Public}
 */
const httpGetAllBootcamps = asyncHandler(async (req, res) => {
  let queryStr = JSON.stringify(req.query);
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );
  const query = await bootcampsDatabas.find(JSON.parse(queryStr));
  const bootcamps = query;
  res
    .status(200)
    .json({ success: true, count: bootcamps.length, data: bootcamps });
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
  return res.status(200).json({ success: true, data: deleteBootcamp });
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

module.exports = {
  httpGetAllBootcamps,
  httpGetBootcamp,
  httpCreateBootcamp,
  httpUpdateBootcamp,
  httpDeleteBootcamp,
  httpGetBootcampsInRadius,
};

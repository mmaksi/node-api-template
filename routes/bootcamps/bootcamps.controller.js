const {
  getAllBootcamps,
  getBootcampById,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
} = require("../../models/Bootcamp.model");
const asyncHandler = require("../../utils/asyncHandler");
const ErrorResponse = require("../../utils/errorResponse");

/**
 * Desc {Get all bootcamps}
 * Route {GET /api/v1/bootcamps}
 * Access {Public}
 */
asyncHandler(async function httpGetAllBootcamps(req, res, next) {
  const bootcamps = await getAllBootcamps();
  res
    .status(200)
    .json({ success: true, count: bootcamps.length, data: bootcamps });
});

/**
 *  Desc {Get single bootcamp}
 *  Route {GET /api/v1/bootcamps/:id}
 *  Access {Public}
 */
asyncHandler(async function httpGetBootcamp(req, res) {
  const bootcamp = await getBootcampById(req.params.id);
  if (!bootcamp) return res.status(404).json({ success: false, data: null });
  return res.status(200).json({ success: true, data: bootcamp });
});

/**
 *  Desc {Create new bootcamp}
 *  Route {POST /api/v1/bootcamps}
 *  Access {Private}
 */
asyncHandler(async function httpCreateBootcamp(req, res) {
  const bootcamp = req.body;
  const response = await createBootcamp(bootcamp);
  res.status(200).json({ success: true, data: response });
});

/**
 *  Desc {Update a bootcamp}
 *  Route {PUT /api/v1/bootcamps}
 *  Access {Private}
 */
asyncHandler(async function httpUpdateBootcamp(req, res) {
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
asyncHandler(async function httpDeleteBootcamp(req, res, next) {
  const deletedBootcamp = await deleteBootcamp(req.params.id);

  if (!deletedBootcamp)
    return res.status(404).json({ success: false, data: null });
  return res.status(200).json({ success: true, data: deleteBootcamp });
});

module.exports = {
  httpGetAllBootcamps,
  httpGetBootcamp,
  httpCreateBootcamp,
  httpUpdateBootcamp,
  httpDeleteBootcamp,
};

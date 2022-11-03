/**
 * @Desc {Get all bootcamps}
 * @Route {GET /api/v1/bootcamps}
 * @Access {Public}
 */
function httpGetAllBootcamps(req, res, next) {
  res.status(200).json({ success: true, msg: "Show all bootcamps" });
}

/**
 * @Desc {Get single bootcamp}
 * @Route {GET /api/v1/bootcamps/:id}
 * @Access {Public}
 */
function httpGetBootcamp(req, res) {
  res.status(200).json({ success: true, msg: "Show all bootcamps" });
}

/**
 * @Desc {Create new bootcamp}
 * @Route {POST /api/v1/bootcamps}
 * @Access {Private}
 */
function httpCreateBootcamp(req, res) {
  res.status(200).json({ success: true, msg: "Show all bootcamps" });
}

/**
 * @Desc {Update a bootcamp}
 * @Route {PUT /api/v1/bootcamps}
 * @Access {Private}
 */
function httpUpdateBootcamp(req, res) {
  res.status(200).json({ success: true, msg: "Show all bootcamps" });
}

/**
 * @Desc {Delete a bootcamp}
 * @Route {DELETE /api/v1/bootcamps}
 * @Access {Private}
 */
function httpDeleteBootcamp(req, res) {
  res.status(200).json({ success: true, msg: "Show all bootcamps" });
}

function httpGetBootcampsInRadius(req, res) {
  res.status(200).json({ success: true, msg: "Show all bootcamps" });
}

function httpBootcampPhotoUp(req, res) {
  res.status(200).json({ success: true, msg: "Show all bootcamps" });
}

module.exports = {
  httpGetAllBootcamps,
  httpGetBootcamp,
  httpCreateBootcamp,
  httpUpdateBootcamp,
  httpDeleteBootcamp,
  httpGetBootcampsInRadius,
  httpBootcampPhotoUp,
};

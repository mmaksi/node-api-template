const advFiltering =
  (model, populate = "") =>
  async (req, res, next) => {
    let query;
    const reqQuery = { ...req.query };

    // Fields to exclude from query parameters
    const removeFields = ["select", "sort", "page", "limit"];
    removeFields.forEach((param) => delete reqQuery[param]);
    let queryStr = JSON.stringify(reqQuery);

    // Select queries
    const selectedFields = req.query.select
      ? req.query.select.split(",").join(" ")
      : "";

    // Mongo queries
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // Sort queries
    const sortBy = req.query.sort
      ? req.query.sort.split(",").join(" ")
      : "-createdAt";

    // Finding resource with optional filters
    query = await model
      .find(JSON.parse(queryStr))
      .select(selectedFields)
      .populate(populate)
      .skip(startIndex)
      .limit(limit)
      .sort(sortBy);

    const totalDocuments = await model.countDocuments();

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

    res.advancedResults = {
      success: true,
      count: query.length,
      pagination,
      data: query,
    };

    next();
  };

module.exports = advFiltering;

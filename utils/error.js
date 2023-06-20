const INVALID_DATA_ERROR = {
  status: "BadRequest",
  error: 400,
};

const NOTFOUND_ERROR = {
  status: "NotFound",
  error: 404,
};

const DEFAULT_ERROR = {
  status: "InternalServerError",
  error: 500,
};

const CONFLICT_ERROR = {
  status: "Conflict",
  error: 409,
};

module.exports = {
  INVALID_DATA_ERROR,
  NOTFOUND_ERROR,
  DEFAULT_ERROR,
  CONFLICT_ERROR,
};

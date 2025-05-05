function errorHandler(err, req, res, next) {
  console.error("Error:", err);

  if (err.name === "ValidationError") {
    return res.status(400).json({
      status: "error",
      message: "Validasi gagal",
      errors: err.errors,
    });
  }

  if (err.name === "MongoError" || err.name === "MongoServerError") {
    if (err.code === 11000) {
      return res.status(409).json({
        status: "error",
        message: "Data duplikat ditemukan",
      });
    }
  }

  return res.status(500).json({
    status: "error",
    message: "Terjadi kesalahan internal server",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
}

function validateRequest(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: "error",
        message: "Data tidak valid",
        errors: error.details.map((detail) => detail.message),
      });
    }
    next();
  };
}

module.exports = {
  errorHandler,
  validateRequest,
};

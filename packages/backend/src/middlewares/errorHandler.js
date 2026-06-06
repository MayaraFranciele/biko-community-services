const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`);

  if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError") {
    return res.status(400).json({
      error: "Dados inválidos.",
      details: err.errors.map((e) => e.message),
    });
  }

  if (err.status) {
    return res.status(err.status).json({ error: err.message });
  }

  return res.status(500).json({ error: "Erro interno do servidor." });
};

module.exports = errorHandler;

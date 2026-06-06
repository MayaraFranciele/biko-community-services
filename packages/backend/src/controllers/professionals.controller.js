const { Professional, User, sequelize } = require("../models");
const { Op } = require("sequelize");

const getProfessionals = async (req, res, next) => {
  try {
    const { categoria, bairro, verified } = req.query;

    const where = {};
    if (categoria) where.categoria = { [Op.like]: `%${categoria}%` };
    if (bairro) where.bairro = { [Op.like]: `%${bairro}%` };
    if (verified !== undefined) where.verified = verified === "true";

    const professionals = await Professional.findAll({
      where,
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "nome", "email"],
        },
      ],
      order: [
        ["verified", "DESC"],
        ["rating", "DESC"],
      ],
    });

    return res.json({ professionals });
  } catch (err) {
    next(err);
  }
};

const getProfessionalById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const professional = await Professional.findByPk(id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "nome", "email"],
        },
      ],
    });

    if (!professional) {
      return res.status(404).json({ error: "Profissional não encontrado." });
    }

    return res.json({ professional });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProfessionals, getProfessionalById };
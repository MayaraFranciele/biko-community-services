const { validationResult } = require("express-validator");
const { ServiceRequest, User, Professional } = require("../models");

const createServiceRequest = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    if (req.user.tipo !== "cliente") {
      return res.status(403).json({ error: "Apenas clientes podem solicitar serviços." });
    }

    const { profissional_id, descricao } = req.body;

    const professional = await Professional.findByPk(profissional_id);
    if (!professional) {
      return res.status(404).json({ error: "Profissional não encontrado." });
    }

    const serviceRequest = await ServiceRequest.create({
      cliente_id: req.user.id,
      profissional_id,
      descricao,
      status: "pendente",
    });

    return res.status(201).json({
      message: "Solicitação enviada com sucesso!",
      serviceRequest,
    });
  } catch (err) {
    next(err);
  }
};

const getMyServiceRequests = async (req, res, next) => {
  try {
    let requests;

    if (req.user.tipo === "profissional") {
      const professional = await Professional.findOne({ where: { user_id: req.user.id } });
      if (!professional) {
        return res.status(404).json({ error: "Perfil de profissional não encontrado." });
      }

      requests = await ServiceRequest.findAll({
        where: { profissional_id: professional.id },
        include: [
          { model: User, as: "cliente", attributes: ["id", "nome", "email"] },
          {
            model: Professional,
            as: "professional",
            include: [{ model: User, as: "user", attributes: ["id", "nome"] }],
          },
        ],
        order: [["createdAt", "DESC"]],
      });
    } else {
      requests = await ServiceRequest.findAll({
        where: { cliente_id: req.user.id },
        include: [
          {
            model: Professional,
            as: "professional",
            include: [{ model: User, as: "user", attributes: ["id", "nome"] }],
          },
        ],
        order: [["createdAt", "DESC"]],
      });
    }

    return res.json({ requests });
  } catch (err) {
    next(err);
  }
};

const updateServiceRequestStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["aceito", "recusado", "concluido"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Status inválido." });
    }

    const request = await ServiceRequest.findByPk(id, {
      include: [{ model: Professional, as: "professional" }],
    });

    if (!request) {
      return res.status(404).json({ error: "Solicitação não encontrada." });
    }

    if (request.professional.user_id !== req.user.id) {
      return res.status(403).json({ error: "Sem permissão para alterar esta solicitação." });
    }

    request.status = status;
    await request.save();

    return res.json({ message: "Status atualizado.", serviceRequest: request });
  } catch (err) {
    next(err);
  }
};

module.exports = { createServiceRequest, getMyServiceRequests, updateServiceRequestStatus };
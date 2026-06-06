const { body } = require("express-validator");

const registerValidator = [
  body("nome")
    .trim()
    .notEmpty()
    .withMessage("Nome é obrigatório.")
    .isLength({ min: 2, max: 100 })
    .withMessage("Nome deve ter entre 2 e 100 caracteres."),

  body("email")
    .trim()
    .isEmail()
    .withMessage("E-mail inválido.")
    .normalizeEmail(),

  body("senha")
    .isLength({ min: 6 })
    .withMessage("Senha deve ter no mínimo 6 caracteres."),

  body("tipo")
    .isIn(["cliente", "profissional"])
    .withMessage("Tipo deve ser 'cliente' ou 'profissional'."),

  body("categoria")
    .if(body("tipo").equals("profissional"))
    .notEmpty()
    .withMessage("Categoria é obrigatória para profissionais."),

  body("bairro")
    .if(body("tipo").equals("profissional"))
    .notEmpty()
    .withMessage("Bairro é obrigatório para profissionais."),
];

const loginValidator = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("E-mail inválido.")
    .normalizeEmail(),

  body("senha")
    .notEmpty()
    .withMessage("Senha é obrigatória."),
];

module.exports = { registerValidator, loginValidator };
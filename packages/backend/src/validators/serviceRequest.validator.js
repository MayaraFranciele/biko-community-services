const { body } = require('express-validator');

const serviceRequestValidator = [
  body('professionalId')
    .isInt()
    .withMessage('ID do profissional inválido. '),

  body('descricao')
    .trim()
    .notEmpty()
    .withMessage('A descrição é obrigatória. ')
    .isLength({ min: 10, max: 1000 })
    .withMessage('A descrição deve conter entre 10 e 1000 caracteres. '),   
];

module.exports = {
  serviceRequestValidator,
};
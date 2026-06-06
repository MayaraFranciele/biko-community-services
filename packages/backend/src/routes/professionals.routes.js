const express = require('express');
const router = express.Router();

const { getProfessionals, getProfessionalById } = require('../controllers/professionals.controller');

router.get('/', getProfessionals);
router.get('/:id', getProfessionalById);

module.exports = router;
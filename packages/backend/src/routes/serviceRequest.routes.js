const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/auth.middlewares');
const { serviceRequestValidator } = require('../validators/serviceRequest.validator');
const { createServiceRequest, getMyServiceRequests, updateServiceRequestStatus } = require('../controllers/serviceRequest.controller');

router.post('/', authMiddleware, serviceRequestValidator, createServiceRequest);

router.get('/', authMiddleware, getMyServiceRequests);       

router.patch('/:id/status', authMiddleware, updateServiceRequestStatus);

module.exports = router;
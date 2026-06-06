const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const categoryRoutes = require('./categories.routes');
const professionalsRoutes = require('./professionals.routes');
const serviceRequestRoutes = require('./serviceRequest.routes');

router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/professionals', professionalsRoutes);
router.use('/service-requests', serviceRequestRoutes);

module.exports = router;
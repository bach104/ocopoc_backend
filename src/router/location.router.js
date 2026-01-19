const express = require('express');
const router = express.Router();
const {
  getAllLocations,
  getLocationById,
  createLocation,
  updateLocation,
  deleteLocation
} = require('../controllers/location.controller');
const { protect } = require('../middlewares/auth.middleware');

// Public routes
router.get('/', getAllLocations);
router.get('/:id', getLocationById);

// Protected routes (chỉ admin)
router.post('/', protect, createLocation);
router.put('/:id', protect, updateLocation);
router.delete('/:id', protect, deleteLocation);

module.exports = router;
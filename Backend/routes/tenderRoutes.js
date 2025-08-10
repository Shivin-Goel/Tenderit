const express = require('express');
const router = express.Router();
const { createTender, getAllTenders, getTenderById, getMyTenders } = require('../controllers/tenderController');
const { protect, requireRole } = require('../middleware/authMiddleware');

// POST: Create tender (only institute)
router.post('/', protect, requireRole(['institute']), createTender);

// GET: All open tenders (vendors + anyone)
router.get('/', protect, getAllTenders);

router.get('/my-tenders', protect, requireRole(['institute']), getMyTenders);

// GET: Tender by ID
router.get('/:id', protect, getTenderById);


module.exports = router;

const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {submitBid, getMyBids, getBidById, getBidsForTender, updateBidStatus} = require('../controllers/bidController');

const { protect, requireRole } = require('../middleware/authMiddleware');

// POST: Submit bid with up to 3 files
router.post(
  '/',
  protect,
  requireRole(['vendor']),
  upload.array('documents', 3),
  submitBid
);

router.get('/my', protect, requireRole(['vendor']), getMyBids);
router.get('/:id', protect, requireRole(['vendor']), getBidById);

// INSTITUTE: View all bids on a tender
router.get(
  '/tender/:tenderId',
  protect,
  requireRole(['institute']),
  getBidsForTender
);

// INSTITUTE: Update bid status
router.put(
  '/:id/status',
  protect,
  requireRole(['institute']),
  updateBidStatus
);


module.exports = router;

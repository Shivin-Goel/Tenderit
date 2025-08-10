const Bid = require('../models/Bid');
const Tender = require('../models/Tender');

//  Submit a bid to a tender (vendor only)
exports.submitBid = async (req, res) => {
  const { tenderId, bidAmount, bidNote } = req.body;
  const files = req.files;

  try {
    const tender = await Tender.findById(tenderId);
    if (!tender) return res.status(404).json({ message: 'Tender not found' });

    const existing = await Bid.findOne({ tender: tenderId, vendor: req.user._id });
    if (existing) return res.status(400).json({ message: 'You already submitted a bid' });

    const filePaths = files.map((file) => file.path.replace(/\\/g, '/'));

    const bid = await Bid.create({
      tender: tenderId,
      vendor: req.user._id,
      bidAmount,
      bidNote,
      documents: filePaths
    });

    res.status(201).json({ message: 'Bid submitted', bid });
  } catch (err) {
    res.status(500).json({ message: 'Failed to submit bid', error: err.message });
  }
};


//  Get all bids by logged-in vendor
exports.getMyBids = async (req, res) => {
  try {
    const bids = await Bid.find({ vendor: req.user._id })
      .populate('tender', 'title budget deadline')
      .sort({ submittedAt: -1 });

    res.json(bids);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching bids', error: err.message });
  }
};

//  Get specific bid detail
exports.getBidById = async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.id)
      .populate('tender', 'title budget deadline postedBy')
      .populate('vendor', 'name email');

    if (!bid) return res.status(404).json({ message: 'Bid not found' });

    // Allow only the vendor who submitted it to view
    if (bid.vendor._id.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Access denied' });

    res.json(bid);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching bid', error: err.message });
  }
};

// Get all bids for a tender (institute only)
exports.getBidsForTender = async (req, res) => {
  const tenderId = req.params.tenderId;

  try {
    const tender = await Tender.findById(tenderId);
    if (!tender) return res.status(404).json({ message: 'Tender not found' });

    if (tender.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied: not your tender' });
    }

    const bids = await Bid.find({ tender: tenderId })
      .populate('vendor', 'name email')
      .sort({ submittedAt: -1 });

    res.json(bids);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching bids', error: err.message });
  }
};

// Update bid status (accept/reject/review)
exports.updateBidStatus = async (req, res) => {
  const { status } = req.body; // 'under review' | 'accepted' | 'rejected'

  try {
    const bid = await Bid.findById(req.params.id).populate('tender');

    if (!bid) return res.status(404).json({ message: 'Bid not found' });

    if (bid.tender.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied: not your tender' });
    }

    bid.status = status;
    await bid.save();

    res.json({ message: 'Bid status updated', bid });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update status', error: err.message });
  }
};



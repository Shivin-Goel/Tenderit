const Tender = require('../models/Tender');

// Create a new tender (institute only)
exports.createTender = async (req, res) => {
  const { title, description, category, budget, deadline } = req.body;

  try {
    const tender = await Tender.create({
      title,
      description,
      category,
      budget,
      deadline,
      postedBy: req.user._id,
      source: 'manual'
    });

    res.status(201).json({ message: 'Tender created', tender });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create tender', error: error.message });
  }
};

//  Get all open tenders
exports.getAllTenders = async (req, res) => {
  try {
    const tenders = await Tender.find({ status: 'open' }).sort({ createdAt: -1 });
    res.json(tenders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch tenders', error: error.message });
  }
};

//  Get tender by ID
exports.getTenderById = async (req, res) => {
  try {
    const tender = await Tender.findById(req.params.id).populate('postedBy', 'name organization');
    if (!tender) return res.status(404).json({ message: 'Tender not found' });
    res.json(tender);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tender', error: error.message });
  }
};

//  Get tenders posted by the logged-in institute
exports.getMyTenders = async (req, res) => {
  try {
    const tenders = await Tender.find({ postedBy: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(tenders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tenders', error: error.message });
  }
};

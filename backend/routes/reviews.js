const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Review = require('../models/Review');

// Get all reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('user', 'username')
      .sort({ 'votes.count': -1, createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's reviews
router.get('/my-reviews', auth, async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.userId })
      .populate('user', 'username')
      .sort({ 'votes.count': -1, createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get a single review by ID
router.get('/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id).populate('user', 'username');
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.json(review);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
router.get('/my-reviews', auth, async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.userId })
      .populate('user', 'username')
      .sort({ 'votes.count': -1, createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create a review
router.post('/', auth, async (req, res) => {
  try {
    const { bookTitle, author, rating, reviewText } = req.body;
    const review = new Review({
      user: req.userId,
      bookTitle,
      author,
      rating,
      reviewText
    });
    await review.save();
    await review.populate('user', 'username');
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update a review
router.put('/:id', auth, async (req, res) => {
  try {
    const { bookTitle, author, rating, reviewText } = req.body;
    const review = await Review.findOne({ _id: req.params.id, user: req.userId });

    if (!review) {
      return res.status(404).json({ message: 'Review not found or unauthorized' });
    }

    review.bookTitle = bookTitle;
    review.author = author;
    review.rating = rating;
    review.reviewText = reviewText;

    await review.save();
    await review.populate('user', 'username');
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete a review
router.delete('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!review) {
      return res.status(404).json({ message: 'Review not found or unauthorized' });
    }
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
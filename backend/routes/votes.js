const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Review = require('../models/Review');

// Vote on a review (like or dislike)
router.post('/:reviewId/vote', auth, async (req, res) => {
  try {
    const { vote } = req.body; // 'like' or 'dislike'
    const reviewId = req.params.reviewId;
    const userId = req.userId;

    if (!['like', 'dislike'].includes(vote)) {
      return res.status(400).json({ message: 'Invalid vote value' });
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user is trying to vote on their own review
    if (review.user.toString() === userId) {
      return res.status(400).json({ message: 'Cannot vote on your own review' });
    }

    // Find if user has already voted
    const existingVoteIndex = review.votes.voters.findIndex(
      v => v.user.toString() === userId
    );

    if (existingVoteIndex > -1) {
      // User has already voted
      const existingVote = review.votes.voters[existingVoteIndex];
      if (existingVote.vote === vote) {
        // Remove vote if clicking the same button
        review.votes[existingVote.vote + 's']--;
        review.votes.voters.splice(existingVoteIndex, 1);
      } else {
        // Change vote
        review.votes[existingVote.vote + 's']--;
        review.votes[vote + 's']++;
        existingVote.vote = vote;
      }
    } else {
      // Add new vote
      review.votes.voters.push({ user: userId, vote });
      review.votes[vote + 's']++;
    }

    await review.save();
    
    return res.json({
      reviewId: review._id,
      likes: review.votes.likes,
      dislikes: review.votes.dislikes,
      userVote: vote
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's vote for a review
router.get('/:reviewId/vote', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    const userVote = review.votes.voters.find(
      v => v.user.toString() === req.userId
    );

    res.json({
      reviewId: review._id,
      likes: review.votes.likes,
      dislikes: review.votes.dislikes,
      userVote: userVote ? userVote.vote : null
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
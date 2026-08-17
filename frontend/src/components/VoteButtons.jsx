import { useState, useEffect } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { ThumbUp, ThumbDown } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const VoteButtons = ({ reviewId, initialLikes = 0, initialDislikes = 0, authorId }) => {
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [userVote, setUserVote] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadUserVote();
    }
  }, [reviewId, user]);

  const loadUserVote = async () => {
    try {
      const { likes, dislikes, userVote } = await api.getReviewVote(reviewId);
      setLikes(likes);
      setDislikes(dislikes);
      setUserVote(userVote);
    } catch (error) {
      console.error('Error loading vote:', error);
    }
  };

  const handleVote = async (voteType) => {
    if (!user) {
      alert('Please login to vote');
      return;
    }

    if (user.id === authorId) {
      alert('You cannot vote on your own review');
      return;
    }

    try {
      const { likes: newLikes, dislikes: newDislikes, userVote: newUserVote } = 
        await api.voteReview(reviewId, voteType);
      setLikes(newLikes);
      setDislikes(newDislikes);
      setUserVote(newUserVote);
    } catch (error) {
      console.error('Error voting:', error);
      alert(error.response?.data?.message || 'Error voting on review');
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton 
          onClick={() => handleVote('like')}
          color={userVote === 'like' ? 'primary' : 'default'}
          size="small"
        >
          <ThumbUp fontSize="small" />
        </IconButton>
        <Typography
          variant="body2"
          sx={{ 
            minWidth: '1.5rem', 
            textAlign: 'center',
            color: 'success.main'
          }}
        >
          {likes}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton 
          onClick={() => handleVote('dislike')}
          color={userVote === 'dislike' ? 'error' : 'default'}
          size="small"
        >
          <ThumbDown fontSize="small" />
        </IconButton>
        <Typography
          variant="body2"
          sx={{ 
            minWidth: '1.5rem', 
            textAlign: 'center',
            color: 'error.main'
          }}
        >
          {dislikes}
        </Typography>
      </Box>
    </Box>
  );
};

export default VoteButtons;
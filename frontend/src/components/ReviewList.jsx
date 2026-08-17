import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { 
  Typography, 
  Grid, 
  Box,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import ReviewCard from './ReviewCard';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import VoteButtons from './VoteButtons';

const ReviewList = ({ userOnly = false }) => {
  const [reviews, setReviews] = useState([]);
  const [sortBy, setSortBy] = useState('mostVoted');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadReviews();
  }, [userOnly, sortBy]);

  const loadReviews = async () => {
    try {
      const data = userOnly ? await api.getUserReviews() : await api.getAllReviews();
      // Sort reviews based on selected criteria
      const sortedReviews = [...data].sort((a, b) => {
        switch (sortBy) {
          case 'mostLiked':
            return (b.votes?.likes || 0) - (a.votes?.likes || 0);
          case 'highestRated':
            return b.rating - a.rating;
          case 'oldest':
            return new Date(a.createdAt) - new Date(b.createdAt);
          case 'newest':
          default:
            return new Date(b.createdAt) - new Date(a.createdAt);
        }
      });
      setReviews(sortedReviews);
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  };

  const handleEdit = (reviewId) => {
    navigate(`/edit-review/${reviewId}`);
  };

  const handleDelete = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await api.deleteReview(reviewId);
        loadReviews();
      } catch (error) {
        console.error('Error deleting review:', error);
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          {userOnly ? 'My Reviews' : 'All Reviews'}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="sort-select-label">Sort By</InputLabel>
            <Select
              labelId="sort-select-label"
              value={sortBy}
              label="Sort By"
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="newest">Newest First</MenuItem>
              <MenuItem value="oldest">Oldest First</MenuItem>
              <MenuItem value="mostLiked">Most Liked</MenuItem>
              <MenuItem value="highestRated">Highest Rated</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/create-review')}
          >
            Add Review
          </Button>
        </Box>
      </Box>
      <Grid container spacing={3}>
        {reviews.map((review) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={review._id}>
            <ReviewCard
              review={review}
              onDelete={handleDelete}
              canEdit={user && user.id === review.user._id}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ReviewList;
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import {
  TextField,
  Button,
  Typography,
  Box,
  Container,
  Rating,
  Alert
} from '@mui/material';

const ReviewForm = () => {
  const [formData, setFormData] = useState({
    bookTitle: '',
    author: '',
    rating: 0,
    reviewText: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      loadReview();
    }
  }, [id]);

  const loadReview = async () => {
    try {
      const reviews = await api.getUserReviews();
      const review = reviews.find(r => r._id === id);
      if (review) {
        setFormData({
          bookTitle: review.bookTitle,
          author: review.author,
          rating: review.rating,
          reviewText: review.reviewText
        });
      }
    } catch (error) {
      setError('Error loading review');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await api.updateReview(id, formData);
      } else {
        await api.createReview(formData);
      }
      navigate('/my-reviews');
    } catch (error) {
      setError(error.response?.data?.message || 'Error saving review');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          {id ? 'Edit Review' : 'Create Review'}
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
            {error}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Book Title"
            name="bookTitle"
            value={formData.bookTitle}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Author"
            name="author"
            value={formData.author}
            onChange={handleChange}
          />
          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography component="legend">Rating</Typography>
            <Rating
              name="rating"
              value={formData.rating}
              onChange={(event, newValue) => {
                setFormData(prev => ({
                  ...prev,
                  rating: newValue
                }));
              }}
            />
          </Box>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Review"
            name="reviewText"
            multiline
            rows={4}
            value={formData.reviewText}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {id ? 'Update Review' : 'Create Review'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ReviewForm;
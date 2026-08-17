import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Card,
  CardContent,
  Typography,
  Rating,
  IconButton,
  Box,
  Container,
  Paper,
  Divider,
  Button
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import VoteButtons from './VoteButtons';

const ReviewDetail = () => {
  const [review, setReview] = useState(null);
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadReview = async () => {
      try {
        const response = await api.getReview(id);
        setReview(response);
      } catch (error) {
        console.error('Error loading review:', error);
        navigate('/all-reviews');
      }
    };
    loadReview();
  }, [id, navigate]);

  const handleEdit = () => {
    navigate(`/edit-review/${id}`);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await api.deleteReview(id);
        navigate('/all-reviews');
      } catch (error) {
        console.error('Error deleting review:', error);
      }
    }
  };

  if (!review) {
    return null;
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        Back to Reviews
      </Button>
      
      <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ p: 3, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {review.bookTitle}
          </Typography>
          <Typography variant="h6">
            by {review.author}
          </Typography>
        </Box>
        
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Rating value={review.rating} size="large" readOnly />
            <VoteButtons
              reviewId={review._id}
              initialVoteCount={review.votes?.count || 0}
              authorId={review.user._id}
            />
          </Box>

          <Divider sx={{ my: 2 }} />
          
          <Typography variant="body1" sx={{ mb: 3, whiteSpace: 'pre-wrap' }}>
            {review.reviewText}
          </Typography>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="textSecondary">
              Reviewed by {review.user.username} on {new Date(review.createdAt).toLocaleDateString()}
            </Typography>
            
            {user && user.id === review.user._id && (
              <Box>
                <IconButton onClick={handleEdit} color="primary">
                  <EditIcon />
                </IconButton>
                <IconButton onClick={handleDelete} color="error">
                  <DeleteIcon />
                </IconButton>
              </Box>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default ReviewDetail;
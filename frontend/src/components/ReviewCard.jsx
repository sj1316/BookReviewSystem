import {
  Card,
  CardContent,
  Typography,
  Rating,
  IconButton,
  Box,
  Button,
  CardActions
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import VoteButtons from './VoteButtons';

const ReviewCard = ({ review, onDelete, canEdit }) => {
  const navigate = useNavigate();
  const truncateText = (text, maxLength = 200) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  return (
    <Card sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: (theme) => theme.shadows[4]
      }
    }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          {review.bookTitle}
        </Typography>
        <Typography color="textSecondary" gutterBottom>
          by {review.author}
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Reviewed by {review.user.username}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 1 }}>
          <Rating value={review.rating} readOnly size="small" />
          <VoteButtons 
            reviewId={review._id}
            initialLikes={review.votes?.likes || 0}
            initialDislikes={review.votes?.dislikes || 0}
            authorId={review.user._id}
          />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
          {truncateText(review.reviewText)}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between', mt: 'auto' }}>
        <Button
          size="small"
          variant="text"
          color="primary"
          onClick={() => navigate(`/review/${review._id}`)}
          sx={{
            '&:hover': {
              backgroundColor: 'action.hover'
            }
          }}
        >
          Read More
        </Button>
        {canEdit && (
          <Box>
            <IconButton size="small" onClick={() => navigate(`/edit-review/${review._id}`)}>
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={() => onDelete(review._id)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        )}
      </CardActions>
    </Card>
  );
};

export default ReviewCard;
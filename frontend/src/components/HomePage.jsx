import { Container, Typography } from '@mui/material';
import ReviewList from './ReviewList';

const HomePage = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography 
        variant="h3" 
        component="h1" 
        gutterBottom 
        sx={{ 
          textAlign: 'center',
          mb: 4,
          fontWeight: 'bold',
          color: 'primary.main'
        }}
      >
        Welcome to Book Reviews
      </Typography>
      <Typography 
        variant="h6" 
        component="p" 
        gutterBottom 
        sx={{ 
          textAlign: 'center',
          mb: 6,
          color: 'text.secondary'
        }}
      >
        Discover what others are reading and share your thoughts on your favorite books
      </Typography>
      <ReviewList userOnly={false} />
    </Container>
  );
};

export default HomePage;
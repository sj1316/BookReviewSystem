const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('./models/User');
const Review = require('./models/Review');

const users = [
  {
    _id: new mongoose.Types.ObjectId(),
    username: 'john_doe',
    email: 'john@example.com',
    password: bcrypt.hashSync('password123', 10)
  },
  {
    _id: new mongoose.Types.ObjectId(),
    username: 'jane_smith',
    email: 'jane@example.com',
    password: bcrypt.hashSync('password123', 10)
  },
  {
    _id: new mongoose.Types.ObjectId(),
    username: 'mike_wilson',
    email: 'mike@example.com',
    password: bcrypt.hashSync('password123', 10)
  }
];

const reviews = [
  {
    user: users[0]._id,
    bookTitle: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    rating: 5,
    reviewText: "A masterpiece of American literature that brilliantly captures the decadence and disillusionment of the Jazz Age. Fitzgerald's prose is both beautiful and haunting, painting a vivid picture of the American Dream's dark side. The character development is exceptional, particularly Jay Gatsby's tragic journey.",
    votes: {
      likes: 15,
      dislikes: 2,
      voters: [
        { user: users[1]._id, vote: 'like' },
        { user: users[2]._id, vote: 'like' }
      ]
    }
  },
  {
    user: users[1]._id,
    bookTitle: '1984',
    author: 'George Orwell',
    rating: 5,
    reviewText: "A chilling dystopian masterpiece that becomes more relevant with each passing year. Orwell's vision of a totalitarian future serves as a powerful warning about the dangers of surveillance, manipulation of truth, and the erosion of individual freedom. The world-building is incredibly detailed and the psychological aspects are haunting.",
    votes: {
      likes: 12,
      dislikes: 1,
      voters: [
        { user: users[0]._id, vote: 'like' },
        { user: users[2]._id, vote: 'like' }
      ]
    }
  },
  {
    user: users[2]._id,
    bookTitle: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    rating: 5,
    reviewText: "This timeless classic masterfully addresses issues of racial injustice and moral growth through the innocent eyes of Scout Finch. Lee's portrayal of small-town Southern life and the complex moral landscape of the adult world is both engaging and profound. Atticus Finch remains one of literature's most admirable characters.",
    votes: {
      likes: 18,
      dislikes: 0,
      voters: [
        { user: users[0]._id, vote: 'like' },
        { user: users[1]._id, vote: 'like' }
      ]
    }
  },
  {
    user: users[0]._id,
    bookTitle: 'Pride and Prejudice',
    author: 'Jane Austen',
    rating: 4,
    reviewText: "Austen's wit and social commentary shine in this beloved classic. The romance between Elizabeth Bennet and Mr. Darcy is expertly crafted, but what really stands out is the sharp observation of early 19th-century society and gender roles. The character development and dialogue are particularly impressive.",
    votes: {
      likes: 10,
      dislikes: 3,
      voters: [
        { user: users[1]._id, vote: 'like' },
        { user: users[2]._id, vote: 'dislike' }
      ]
    }
  },
  {
    user: users[1]._id,
    bookTitle: 'The Lord of the Rings',
    author: 'J.R.R. Tolkien',
    rating: 5,
    reviewText: "An epic masterpiece that defined the fantasy genre. Tolkien's world-building is unparalleled, creating a rich mythology and fully realized world with its own languages and history. The themes of friendship, courage, and the corruption of power are timeless. The character development throughout the trilogy is exceptional.",
    votes: {
      likes: 20,
      dislikes: 1,
      voters: [
        { user: users[0]._id, vote: 'like' },
        { user: users[2]._id, vote: 'like' }
      ]
    }
  },
  {
    user: users[2]._id,
    bookTitle: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    rating: 4,
    reviewText: "Salinger captures teenage alienation and rebellion perfectly through Holden Caulfield's unique voice. While some might find Holden's cynicism grating, it's a brilliant portrayal of adolescent angst and the search for authenticity. The stream-of-consciousness narrative style is particularly effective.",
    votes: {
      likes: 8,
      dislikes: 4,
      voters: [
        { user: users[0]._id, vote: 'dislike' },
        { user: users[1]._id, vote: 'like' }
      ]
    }
  }
];

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Review.deleteMany({});

    // Insert users
    const createdUsers = await User.insertMany(users);
    console.log('Users seeded successfully');

    // Insert reviews
    const createdReviews = await Review.insertMany(reviews);
    console.log('Reviews seeded successfully');

    return { users: createdUsers, reviews: createdReviews };
  } catch (error) {
    console.error('Error seeding data:', error);
    throw error;
  }
};

module.exports = seedData;
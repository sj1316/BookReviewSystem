const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Review = require('../models/Review');

const sampleBooks = [
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    reviews: [
      { rating: 5, text: "A masterpiece of American literature. The prose is beautiful and the story is timeless." },
      { rating: 4, text: "Fascinating portrayal of the American Dream and its dark side. The characters are unforgettable." }
    ]
  },
  {
    title: "1984",
    author: "George Orwell",
    reviews: [
      { rating: 5, text: "A chilling and prophetic novel that becomes more relevant each year. The world-building is incredible." },
      { rating: 4, text: "Thought-provoking and disturbing. A must-read for understanding the dangers of totalitarianism." }
    ]
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    reviews: [
      { rating: 5, text: "A powerful story about justice and moral growth. Scout's narrative voice is perfect." },
      { rating: 5, text: "This book changed my perspective on so many things. The characters feel so real." }
    ]
  },
  {
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    reviews: [
      { rating: 4, text: "A delightful adventure that started my love for fantasy. Bilbo is such a relatable character." },
      { rating: 5, text: "The world-building is amazing, and the story is both fun and meaningful." }
    ]
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    reviews: [
      { rating: 5, text: "Witty, romantic, and socially insightful. Elizabeth Bennet is an amazing character." },
      { rating: 4, text: "The social commentary is as relevant today as it was then. A true classic." }
    ]
  }
];

// Sample users
const users = [
  {
    username: "bookworm",
    email: "bookworm@example.com",
    password: "password123"
  },
  {
    username: "literaturelover",
    email: "literature@example.com",
    password: "password123"
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Review.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const createdUsers = await Promise.all(
      users.map(async user => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        return User.create({
          ...user,
          password: hashedPassword
        });
      })
    );
    console.log('Created users');

    // Create reviews
    let reviewCount = 0;
    for (const book of sampleBooks) {
      const promises = book.reviews.map(async (review, index) => {
        const user = createdUsers[index % createdUsers.length];
        const newReview = await Review.create({
          user: user._id,
          bookTitle: book.title,
          author: book.author,
          rating: review.rating,
          reviewText: review.text,
          votes: {
            count: Math.floor(Math.random() * 20) - 5, // Random votes between -5 and 15
            voters: []
          }
        });
        reviewCount++;
        return newReview;
      });
      await Promise.all(promises);
    }

    console.log(`Successfully seeded database with ${createdUsers.length} users and ${reviewCount} reviews`);
    console.log('\nSample user credentials:');
    users.forEach(user => {
      console.log(`Username: ${user.username}`);
      console.log(`Email: ${user.email}`);
      console.log(`Password: ${user.password}\n`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
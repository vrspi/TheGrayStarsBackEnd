import mongoose from 'mongoose';

const heroSectionSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  backgroundImage: String
});

const featuredProductSchema = new mongoose.Schema({
  id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }
});

const aboutSectionSchema = new mongoose.Schema({
  title: String,
  content: String,
  image: String
});

const homePageSchema = new mongoose.Schema({
  heroSection: heroSectionSchema,
  featuredProducts: [featuredProductSchema],
  aboutSection: aboutSectionSchema,
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

export const HomePage = mongoose.model('HomePage', homePageSchema);

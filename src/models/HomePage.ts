import { Schema, model, Document } from 'mongoose';

interface IHeroSection {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
}

interface IFeaturedProduct {
  id: Schema.Types.ObjectId;
}

interface IAboutSection {
  title: string;
  content?: string;
  image?: string;
}

export interface IHomePage extends Document {
  heroSection: IHeroSection;
  featuredProducts: IFeaturedProduct[];
  aboutSection: IAboutSection;
  lastUpdated: Date;
}

const heroSectionSchema = new Schema<IHeroSection>({
  title: String,
  subtitle: String,
  backgroundImage: String
});

const featuredProductSchema = new Schema<IFeaturedProduct>({
  id: {
    type: Schema.Types.ObjectId,
    ref: 'Product'
  }
});

const aboutSectionSchema = new Schema<IAboutSection>({
  title: String,
  content: String,
  image: String
});

const homePageSchema = new Schema<IHomePage>({
  heroSection: heroSectionSchema,
  featuredProducts: [featuredProductSchema],
  aboutSection: aboutSectionSchema,
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

export const HomePage = model<IHomePage>('HomePage', homePageSchema);

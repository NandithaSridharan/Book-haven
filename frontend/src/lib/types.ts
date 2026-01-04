export type User = {
  id: string;
  name: string;
  email: string;
  bio: string;
  profileImage: string;
  readingInterests: string[];
  followers: number;
  following: number;
  role: 'guest' | 'reader' | 'admin';
};

export type Review = {
  id: string;
  bookId: string;
  userId: string;
  rating: number;
  comment: string;
  likes: number;
  createdAt: string;
};

export type Book = {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  averageRating: number;
  availability: 'Available' | 'Checked Out';
  description: string;
  reviews: Review[];
  genre: string;
};

export type ReadingProgress = {
  bookId: string;
  status: 'reading' | 'completed';
  startedDate: string;
  completedDate?: string;
};

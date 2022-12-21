import { BookData } from './BookTypes';

export type AuthorData = {
  _id: string;
  name: string;
  slug: string;
  born: Date;
  bio: string;
  image: string;
  booksWritten: string[];
  featured: boolean;
  createdAt: Date;
};

export type AuthorDataPopulated = {
  _id: string;
  slug: string;
  name: string;
  born: Date;
  bio: string;
  image: string;
  booksWritten: BookData[];
  featured: boolean;
  createdAt: Date;
};

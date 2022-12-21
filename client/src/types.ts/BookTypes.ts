import { AuthorData } from './AuthorTypes';

export type BookData = {
  _id: string;
  title: string;
  isbn: string;
  description: string;
  authors: string[];
  publisher: string;
  publishedYear: number;
  genres: string[];
  pageCount: number;
  image: string;
  rating: number;
  isBorrowed: boolean;
  borrowerId: string;
  borrowDate: Date;
  returnDate: Date;
};

export type BookDataPopulated = {
  _id: string;
  title: string;
  isbn: string;
  description: string;
  authors: AuthorData[];
  publisher: string;
  publishedYear: number;
  genres: string[];
  pageCount: number;
  image: string;
  rating: number;
  isBorrowed: boolean;
  borrowerId: string;
  borrowDate: Date;
  returnDate: Date;
};

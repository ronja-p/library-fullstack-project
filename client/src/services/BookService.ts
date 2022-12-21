import axios from 'axios';
import { API_URL } from 'util/secrets';

axios.defaults.withCredentials = true;

let baseUrl = `${API_URL}/api/v1`;

// GET /books
export const getBooks = async () => {
  try {
    const response = await axios.get(`${baseUrl}/books`);
    return response.data;
  } catch (error: any) {
    if (error) {
      return error.response.data;
    }
  }
};

// GET /books/count
export const countTotalBooks = async () => {
  try {
    const response = await axios.get(`${baseUrl}/books/count`);
    return response.data;
  } catch (error: any) {
    if (error) {
      return error.response.data;
    }
  }
};

// GET /books/paginate
export const getBooksAndPaginate = async (page: number) => {
  try {
    const response = await axios.get(`${baseUrl}/books/paginate?page=${page}`);
    return response.data;
  } catch (error: any) {
    if (error) {
      return error.response.data;
    }
  }
};

// GET /books/search
export const searchBooks = async (searchValue: string) => {
  try {
    const response = await axios.get(
      `${baseUrl}/books/search?searchValue=${searchValue}`
    );
    return response.data;
  } catch (error: any) {
    if (error) {
      return error.response.data;
    }
  }
};

// GET /books/:bookId
export const getBookById = async (bookId: string) => {
  try {
    const response = await axios.get(`${baseUrl}/books/${bookId}`);
    return response.data;
  } catch (error: any) {
    if (error) {
      return error.response.data;
    }
  }
};

// GET /books/populate/:bookId
export const getPopulatedBook = async (bookId: string) => {
  try {
    const response = await axios.get(`${baseUrl}/books/populate/${bookId}`);
    return response.data;
  } catch (error: any) {
    if (error) {
      return error.response.data;
    }
  }
};

// POST /books
export const addBook = async (formData: FormData) => {
  try {
    const response = await axios.post(`${baseUrl}/books`, formData);
    return response.data;
  } catch (error: any) {
    if (error) {
      return error.response.data;
    }
  }
};

// PUT /books/:bookId
export const updateBook = async (formData: FormData, bookId: string) => {
  try {
    const response = await axios.put(`${baseUrl}/books/${bookId}`, formData);
    return response.data;
  } catch (error: any) {
    if (error) {
      return error.response.data;
    }
  }
};

// PATCH /books/borrow/:bookId
export const borrowBook = async (bookId: string) => {
  try {
    const response = await axios.patch(`${baseUrl}/books/borrow/${bookId}`);
    return response.data;
  } catch (error: any) {
    if (error) {
      return error.response.data;
    }
  }
};

// PATCH /books/return/:bookId
export const returnBook = async (bookId: string) => {
  try {
    const response = await axios.patch(`${baseUrl}/books/return/${bookId}`);
    return response.data;
  } catch (error: any) {
    if (error) {
      return error.response.data;
    }
  }
};

// DELETE /books/:bookId
export const deleteBook = async (bookId: string) => {
  try {
    const response = await axios.delete(`${baseUrl}/books/${bookId}`);
    return response.data;
  } catch (error: any) {
    if (error) {
      return error.response.data;
    }
  }
};

// GET /books/sort
export const getSortedBooks = async (property: string, order: number) => {
  try {
    const response = await axios.get(
      `${baseUrl}/books/sort?property=${property}&order=${order}`
    );
    return response.data;
  } catch (error: any) {
    if (error) {
      return error.response.data;
    }
  }
};

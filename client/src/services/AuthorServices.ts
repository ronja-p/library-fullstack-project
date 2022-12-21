import axios from 'axios';
import { API_URL } from 'util/secrets';

axios.defaults.withCredentials = true;

let baseUrl = `${API_URL}/api/v1`;

// GET /authors
export const getAuthors = async () => {
  try {
    const response = await axios.get(`${baseUrl}/authors`);
    return response.data;
  } catch (error: any) {
    if (error) {
      return error.response.data;
    }
  }
};

// POST /authors
export const createAuthor = async (formData: FormData) => {
  try {
    const response = await axios.post(`${baseUrl}/authors`, formData);
    return response.data;
  } catch (error: any) {
    if (error) {
      return error.response.data;
    }
  }
};

// GET /authors/:authorId
export const getAuthorById = async (authorId: string) => {
  try {
    const response = await axios.get(`${baseUrl}/authors/${authorId}`);
    return response.data;
  } catch (error: any) {
    if (error) {
      return error.response.data;
    }
  }
};

// GET /authors/profile/:authorSlug
export const getAuthorBySlug = async (authorSlug: string) => {
  try {
    const response = await axios.get(
      `${baseUrl}/authors/profile/${authorSlug}`
    );
    return response.data;
  } catch (error: any) {
    if (error) {
      return error.response.data;
    }
  }
};

// PUT /authors/:authorId
export const updateAuthor = async (formData: FormData, authorId: string) => {
  try {
    const response = await axios.put(
      `${baseUrl}/authors/${authorId}`,
      formData
    );
    return response.data;
  } catch (error: any) {
    if (error) {
      return error.response.data;
    }
  }
};

// DELETE /authors/:authorId
export const deleteAuthor = async (authorId: string) => {
  try {
    const response = await axios.delete(`${baseUrl}/authors/${authorId}`);
    return response.data;
  } catch (error: any) {
    if (error) {
      return error.response.data;
    }
  }
};

// PUT /authors/feature
export const featureAuthor = async (
  authorId: string,
  data: { featureStatus: boolean }
) => {
  try {
    const response = await axios.put(
      `${baseUrl}/authors/feature/${authorId}`,
      data
    );
    return response.data;
  } catch (error: any) {
    if (error) {
      return error.response.data;
    }
  }
};

// GET /authors/feature
export const getFeaturedAuthors = async () => {
  try {
    const response = await axios.get(`${baseUrl}/authors/feature`);
    return response.data;
  } catch (error: any) {
    if (error) {
      return error.response.data;
    }
  }
};

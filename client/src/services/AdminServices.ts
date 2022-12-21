import axios from 'axios';
import { API_URL } from 'util/secrets';

axios.defaults.withCredentials = true;

let baseUrl = `${API_URL}/api/v1`;

// GET /users
export const getUsers = async () => {
  try {
    const response = await axios.get(`${baseUrl}/users`);
    return response.data;
  } catch (error: any) {
    if (error) {
      return error.response.data;
    }
  }
};

// GET /users/:userId
export const getUserById = async (userId: string) => {
  try {
    const response = await axios.get(`${baseUrl}/users/${userId}`);
    return response.data;
  } catch (error: any) {
    if (error) {
      return error.response.data;
    }
  }
};

import axios from 'axios';
import {
  LoginRequest,
  RecoveryEmailRequest,
  ResetPasswordRequest,
  UpdatePasswordRequest,
} from 'types.ts/UserTypes';
import { API_URL } from 'util/secrets';

axios.defaults.withCredentials = true;

let baseUrl = `${API_URL}/api/v1/users`;

// POST /users/register
export const registerUser = async (formData: FormData) => {
  try {
    const response = await axios.post(`${baseUrl}/register`, formData);
    return response.data;
  } catch (error: any) {
    if (error) {
      return error.response.data;
    }
  }
};

// GET /users/activate
export const activateUser = async (token: string | undefined) => {
  try {
    const response = await axios.get(`${baseUrl}/activate`, {
      headers: {
        Authorization: token,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error) {
      return error.response.data;
    }
  }
};

// POST /users/login
export const loginUser = async (values: LoginRequest) => {
  try {
    const response = await axios.post(`${baseUrl}/login`, values);
    return response.data;
  } catch (error: any) {
    if (error) {
      return error.response.data;
    }
  }
};

// POST /users/logout
export const logoutUser = async () => {
  try {
    const response = await axios.get(`${baseUrl}/logout`);
    return response.data;
  } catch (error: any) {
    if (error) {
      return error.response.data;
    }
  }
};

// POST /users/refresh
export const refreshToken = async () => {
  try {
    const response = await axios.get(`${baseUrl}/refresh`);
    return response.data;
  } catch (error: any) {
    if (error) {
      return error.response.data;
    }
  }
};

// GET /users/check-login
export const checkLogin = async (token: string) => {
  try {
    const response = await axios.get(`${baseUrl}/check-login`, {
      headers: {
        Authorization: token,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error) {
      return error.response.data;
    }
  }
};

// GET /users/check-admin
export const checkAdmin = async (token: string) => {
  try {
    const response = await axios.get(`${baseUrl}/check-admin`, {
      headers: {
        Authorization: token,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error) {
      return error.response.data;
    }
  }
};

// POST /users/recover
export const sendRecoveryEmail = async (values: RecoveryEmailRequest) => {
  try {
    const response = await axios.post(`${baseUrl}/recover`, values);
    return response.data;
  } catch (error: any) {
    if (error) {
      return error.response.data;
    }
  }
};

// POST /users/recover/:recoveryToken
export const resetPassword = async (
  values: ResetPasswordRequest,
  recoveryToken: string | undefined
) => {
  try {
    const response = await axios.post(
      `${baseUrl}/recover/${recoveryToken}`,
      values
    );
    return response.data;
  } catch (error: any) {
    if (error) {
      return error.response.data;
    }
  }
};

// GET /users/profile
export const getUserProfile = async () => {
  try {
    const response = await axios.get(`${baseUrl}/profile`);
    return response.data;
  } catch (error: any) {
    if (error) {
      return error.response.data;
    }
  }
};

// PUT /users/:userId
export const updateUser = async (formData: FormData, userId: string) => {
  try {
    const response = await axios.put(`${baseUrl}/${userId}`, formData);
    return response.data;
  } catch (error: any) {
    if (error) {
      return error.response.data;
    }
  }
};

// PUT /users/:userId
export const updateUserPassword = async (
  values: UpdatePasswordRequest,
  userId: string
) => {
  try {
    const response = await axios.put(`${baseUrl}/password/${userId}`, values);
    return response.data;
  } catch (error: any) {
    if (error) {
      return error.response.data;
    }
  }
};

// DELETE /users/:userId
export const deleteUser = async (userId: string) => {
  try {
    const response = await axios.delete(`${baseUrl}/${userId}`);
    return response.data;
  } catch (error: any) {
    if (error) {
      return error.response.data;
    }
  }
};

export type UserActivationData = {
  firstName: string;
  lastName: string;
};

// user state used in userSlice
export type UserState = {
  data: LoginResponse;
};

// login request
export type LoginRequest = {
  email: string;
  password: string;
};

// login response
export type LoginResponse = {
  token: string;
  userData: UserData;
  isLoggedIn: boolean;
};

// user data in login response
export type UserData = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture: string;
  isAdmin: boolean;
  borrowedBooks: string[];
  createdAt: Date;
};

// password update request
export type UpdatePasswordRequest = {
  password: string;
  passwordConfirm: string;
};

// recovery email request
// reset password request
export type RecoveryEmailRequest = {
  email: string;
};

// reset password request
export type ResetPasswordRequest = {
  email: string;
  password: string;
};

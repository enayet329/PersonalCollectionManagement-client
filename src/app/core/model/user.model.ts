export interface UserModel {
  id: string;
  username: string;
  email: string;
  imageURL: string;
  prefrredLanguage: string;
  preffrredThemeDark: boolean;
  joinedAt: string;
  isAdmin: boolean;
  isBlocked: boolean;
}

export interface UserLoginModel{
    email: string;
    password: string;
}

export interface UserRegisterModel{
    username: string;
    email: string;
    passwordHash: string;
    imageURL: string;
}


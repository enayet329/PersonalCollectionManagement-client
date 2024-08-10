
export interface AddComment {
  content: string;
  createdAt: Date;
  userId: string;
  itemId: string;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  userId: string; 
  itemId: string; 
  userName: string;
  userProfileImgeUrl: string;
}

export interface CommentResponse {
  success: boolean;
  message: string;
  accessToken?: string;
  refreshToken?: string;
  prefferedLanguage?: string;
  prefferedThemDark?: boolean;
}
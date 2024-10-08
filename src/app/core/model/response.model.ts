export interface ResponseModel {
  success: boolean;
  message: string;
  accessToken: string | null;
  refreshToken: string | null;
  preferredLanguage: string | null;
  preferredThemeDark: boolean;
}

export interface LikeResponseModel {
  success: boolean;
  message: string;
  likeCount: number;
}
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommentConstants } from '../constants/constants';
import { Observable } from 'rxjs';
import { Comment, AddComment, CommentResponse } from '../model/comment.model';
import { ResponseModel } from '../model/response.model';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private apiUrl = CommentConstants.API_ENDPOINTS;

  constructor(private httpClient: HttpClient) {}

  getCommetsByItemId(itemId: string): Observable<Comment[]> {
    const url = this.apiUrl.GET_COMMENTS_BY_ITEM_ID;
    const params = { itemId: itemId };
    return this.httpClient.get<Comment[]>(url, { params: params });
  }

  createComment(comment: AddComment): Observable<CommentResponse> {
    const url = this.apiUrl.ADD_COMMENT;
    return this.httpClient.post<CommentResponse>(url, comment);
  }

  deleteComment(commentId: string): Observable<ResponseModel> {
    const url = `${this.apiUrl.DELETE_COMMENT}?commentId=${commentId}`
    return this.httpClient.delete<ResponseModel>(url);
  }
}

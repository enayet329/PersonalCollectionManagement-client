import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { Item } from '../../../core/model/item.model';
import { AddComment, Comment } from '../../../core/model/comment.model';
import { ItemService } from '../../../core/services/item.service';
import { CommentService } from '../../../core/services/comment.service';
import { LikeService } from '../../../core/services/like.service';
import { JwtDecoderService } from '../../../core/services/jwt-decoder.service';
import { LikeResponseModel, ResponseModel } from '../../../core/model/response.model';
import {  AddTagResponse } from '../../../core/model/tag.model';
import { TagService } from '../../../core/services/tag.service';
import { CustomFieldValueService } from '../../../core/services/custom-field-value.service';
import { CustomFieldValue, CustomFieldValueResponse } from '../../../core/model/customFieldValue.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-item-detail',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, NgbDropdownModule],
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.css'],
})
export class ItemDetailComponent implements OnInit {
  itemId: string = '';
  item: Item = {} as Item;
  like: LikeResponseModel = {} as LikeResponseModel;
  comments: Comment[] = [];
  newComment: AddComment = {} as AddComment;
  tags: AddTagResponse[] = [];
  customFieldValues: CustomFieldValueResponse[] = [];

  hasLiked: boolean = false;
  likeCount: number = 0;
  isLoadingComments: boolean = true;
  isItemLoading: boolean = true;

  // User state
  user: any = null;
  private token: string | null = null;
  userId: string | null = null;
  isAdmin: boolean = false;
  isLoggedIn: boolean = false;
  isBlocked: boolean = false;
  preferredLanguage: string | null = null;
  preferredThemeDark: boolean = false;
  currentLanguage: string | null = null;


  constructor(
    private route: ActivatedRoute,
    private itemService: ItemService,
    private commentService: CommentService,
    private likeService: LikeService,
    private jwtDecode: JwtDecoderService,
    private tagService: TagService,
    private toaster: ToastrService,
    private customFieldValueService: CustomFieldValueService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.itemId = this.route.snapshot.paramMap.get('id')!;
    this.initializeUserState();
    this.getItem();
    this.getTagsByItemId();
    this.getCustomFields();
    this.getComments();
  }

  private initializeUserState() {
    this.token = localStorage.getItem('token');
    if (this.token && !this.jwtDecode.isTokenExpired(this.token)) {
      this.userId = this.jwtDecode.getUserIdFromToken(this.token);
      this.isAdmin = this.jwtDecode.getIsAdminFromToken(this.token);
      this.isBlocked = this.jwtDecode.getIsBlockedFromToken(this.token);
      this.preferredLanguage = this.jwtDecode.getPreferredLanguageFromToken(this.token);
      this.preferredThemeDark = this.jwtDecode.getPreferredThemeDarkFromToken(this.token);
      this.user = {
        id: this.userId,
        username: this.jwtDecode.getUsernameFromToken(this.token),
        email: this.jwtDecode.getEmailFromToken(this.token),
        isAdmin: this.isAdmin,
        isBlocked: this.isBlocked,
      };
      this.isLoggedIn = true;
      this.currentLanguage = this.preferredLanguage || 'en';
    } else {
      this.resetUserState();
    }
  }

  private resetUserState() {
    this.isLoggedIn = false;
    this.isAdmin = false;
    this.userId = null;
    this.user = null;
    this.token = null;
    this.isBlocked = false;
    this.preferredLanguage = null;
    this.preferredThemeDark = false;
    this.currentLanguage = 'en';
  }

  getItem(): void {
    this.itemService.getItemById(this.itemId).subscribe(
      (data) => {
        this.item = data;
        this.like.likeCount = this.item.likes;
        this.isItemLoading = false;
        this.checkIfItemLiked();
      },
      (error) => {
        console.error('Error fetching item details', error);
        this.toaster.error('Failed to load item details', 'Error');
      }
    );
  }

  checkIfItemLiked(): void {
    if (this.user && this.userId) {
      this.likeService.isItemLiked(this.userId, this.itemId).subscribe({
        next: (response) => {
          this.hasLiked = response.success;
        },
        error: (error) => {
          console.error('Error checking if item is liked:', error);
        },
      });
    }
  }

  getComments(): void {
    this.commentService.getCommetsByItemId(this.itemId).subscribe(
      (comments) => {
        this.comments = comments;
        this.isLoadingComments = false;
      },
      (error) => {
        console.error('Error fetching comments:', error);
        this.toaster.error('Failed to load comments', 'Error');
      }
    );
  }

  addComment(): void {
    this.newComment.itemId = this.itemId;
    this.newComment.userId = this.userId!;
    this.newComment.createdAt = new Date();

    this.commentService.createComment(this.newComment).subscribe(
      (response) => {
        if (response.success) {
          this.getComments();
          this.newComment = {} as AddComment;
          this.toaster.success('Comment added successfully', 'Success');
        } else {
          this.toaster.error('Failed to add comment', 'Error');
        }
      },
      (error) => {
        console.error('Error adding comment:', error);
        this.toaster.error('An error occurred while adding the comment', 'Error');
      }
    );
  }
  onEnter(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    if (keyboardEvent.key === 'Enter') {
      this.addComment();
    }
  }
  

  toggleLike(): void {
    if (!this.isLoggedIn || !this.userId) {
      this.toaster.warning('You must be logged in to like items', 'Warning');
      return;
    }

    const likeData = {
      itemId: this.itemId,
      userId: this.userId,
    };

    this.likeService.toggleLike(likeData).subscribe(
      (response) => {
        this.hasLiked = response.success;
        this.like = response;
        if (response.success) {
          this.toaster.success('Item liked successfully', 'Success');
        } else {
          this.toaster.info('Item unliked successfully', 'Info');
        }
      },
      (error) => {
        console.error('Error toggling like:', error);
        this.toaster.error('An error occurred while processing your request', 'Error');
      }
    );
  }

 getTagsByItemId(): void {
    this.tagService.getTagsByItemId(this.itemId).subscribe(
      (response: AddTagResponse[]) => {
        if(response.length > 0){
          this.tags = response;
          console.log(this.tags);
        }
      },
      (error) => {
        console.error('Error fetching tags:', error);
      }
    );
  }

  getCustomFields(): void {
    this.customFieldValueService.getCustomFieldValueByItemId(this.itemId).subscribe(
      (response: CustomFieldValueResponse[]) => {
        this.customFieldValues = response;
        console.log("custom Field values loaded");
      }
    )
  }

  handleDropdownClick(action: string): void {
    if (action === 'edit') {
      this.editItem();
    } else if (action === 'delete') {
      this.deleteItem();
    }
  }

  handleCommentDropdownClick(action: string, commentId: string): void {
    if (action === 'edit') {
      this.editComment(commentId);
    } else if (action === 'delete') {
      this.deleteComment(commentId);
    }
  }

  editItem(): void {
    this.router.navigate(['/edit-item', this.itemId]);
  }

  deleteItem(): void {
    if (confirm('Are you sure you want to delete this item?')) {
      this.itemService.deleteItemById(this.itemId).subscribe(
        (response: ResponseModel) => {
          if (response.success) {
            this.toaster.success('Item deleted successfully', 'Success');
            this.router.navigate(['/collection-detail', this.item.collectionId]);
          } else {
            this.toaster.error('Failed to delete item', 'Error');
            console.error('Failed to delete item', response.message);
          }
        }
      )
    }
  }

  editComment(commentId: string): void {
    console.log('Edit comment', commentId);
    this.toaster.info('Edit comment functionality not implemented yet', 'Info');
  }

  deleteComment(commentId: string): void {
   
      this.commentService.deleteComment(commentId).subscribe(
        (response: ResponseModel) => {
          if (response.success) {
            this.toaster.success('Comment deleted successfully', 'Success');
            this.getComments();
          }
        }
      )
    }



  goToCollection(collectionId: string): void {
    this.router.navigate(['/collection-detail', collectionId]);
  }
}

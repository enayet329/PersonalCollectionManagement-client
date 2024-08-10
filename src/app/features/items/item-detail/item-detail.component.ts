import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Item } from '../../../core/model/item.model';
import { ItemService } from '../../../core/services/item.service';
import { CommentService } from '../../../core/services/comment.service';
import { AddComment, Comment } from '../../../core/model/comment.model';
import { CommonModule } from '@angular/common';
import { LikeService } from '../../../core/services/like.service';
import { JwtDecoderService } from '../../../core/services/jwt-decoder.service';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-item-detail',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.css'],
})
export class ItemDetailComponent implements OnInit {
  itemId: string = '';
  item: Item = {} as Item;
  comments: Comment[] = [];
  newComment: AddComment = {} as AddComment;
  hasLiked: boolean = false;
  likeCount: number = 0;

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
    private toaster: ToastrService,
  ) {}

  ngOnInit(): void {
    this.itemId = this.route.snapshot.paramMap.get('id')!;
    this.initializeUserState();
    this.getItem();
    this.getComments();
  }

  private initializeUserState() {
    this.token = localStorage.getItem('token');
    if (this.token && !this.jwtDecode.isTokenExpired(this.token)) {
      this.userId = this.jwtDecode.getUserIdFromToken(this.token);
      this.isAdmin = this.jwtDecode.getIsAdminFromToken(this.token);
      this.isBlocked = this.jwtDecode.getIsBlockedFromToken(this.token);
      this.preferredLanguage = this.jwtDecode.getPreferredLanguageFromToken(
        this.token
      );
      this.preferredThemeDark = this.jwtDecode.getPreferredThemeDarkFromToken(
        this.token
      );
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
    localStorage.removeItem('token');
  }

  getItem(): void {
    this.itemService.getItemById(this.itemId).subscribe(
      (data) => {
        this.item = data;
        this.likeCount = this.item.likes;
        this.checkIfItemLiked();
        console.log(this.item);
      },
      (error) => {
        console.error('Error fetching item details', error);
      }
    );
  }

  checkIfItemLiked(): void {
    if (this.user && this.userId) {
      this.likeService.isItemLiked(this.userId, this.itemId).subscribe({
        next: (response) => {
          this.hasLiked = response.success;
          console.log(response);
        },
        error: (error) => {
          console.error('Error:', error);
        },
      });
    }
  }

  getComments(): void {
    this.commentService.getCommetsByItemId(this.itemId).subscribe(
      (comments) => {
        this.comments = comments;
      },
      (error) => {
        console.error('Error fetching comments:', error);
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
          console.error('Error adding comment:', response.message);
        }
      },
      (error) => {
        console.error('Error adding comment:', error);
      }
    );
  }

  toggleLike(): void {
    if (!this.isLoggedIn || !this.userId) {
      console.error('User is not logged in or userId is null');
      return;
    }

    const likeData = {
      itemId: this.itemId,
      userId: this.userId,
    };

    this.likeService.toggleLike(likeData).subscribe(
      (response) => {
        this.hasLiked = response.success == true;
        this.likeCount = response.likes;
        if (response.success) {
          this.toaster.success('Item liked successfully', 'Success');
        } else {
          this.toaster.info('Remove like successfully', 'Removed');
        }
      },
      (error) => {
        console.error('Error toggling like:', error);
      }
    );
  }

  deleteItem(itemId: string): void {
    // Implement delete item logic here
  }

  deleteComment(commentId: string): void {
    // Implement delete comment logic here
  }
}

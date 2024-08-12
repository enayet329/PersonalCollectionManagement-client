import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { CollectionService } from '../../../core/services/collection.service';
import { UserModel } from '../../../core/model/user.model';
import { JwtDecoderService } from '../../../core/services/jwt-decoder.service';
import { Collection } from '../../../core/model/collection.mode.';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile-view.component.html',
  styleUrl: './profile-view.component.css',
})
export class ProfileViewComponent implements OnInit {

  user: UserModel = {} as UserModel;
  users: any = [];
  collections: Collection[] = [];

  //user state
  private token: string | null = null;
  userId: string | null = null;
  isAdmin: boolean = false;
  userIsLoggedIn: boolean = false;
  isBlocked: boolean = false;
  preferredLanguage: string | null = null;
  preferredThemeDark: boolean = false;

  httpClient = inject(HttpClient);

  constructor(
    private UserServices: UserService,
    private collectionServices: CollectionService,
    private jwtDecoder: JwtDecoderService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initializeUserState();
    this.getUserProfile();
    this.getCollectionsByUserId();
  }

  private initializeUserState() {
    this.token = localStorage.getItem('token');
    if (this.token && !this.jwtDecoder.isTokenExpired(this.token)) {
      this.userId = this.jwtDecoder.getUserIdFromToken(this.token);
      this.isAdmin = this.jwtDecoder.getIsAdminFromToken(this.token);
      this.isBlocked = this.jwtDecoder.getIsBlockedFromToken(this.token);
      this.userIsLoggedIn = true;
    } else {
      this.resetUserState();
    }
  }

  private resetUserState() {
    this.userIsLoggedIn = false;
    this.isAdmin = false;
    this.userId = null;
    this.users = null;
    this.token = null;
    this.isBlocked = false;
  }
  getUserProfile() {
    this.UserServices.getUserById(this.userId!).subscribe((response) => {
      this.user = response;
      console.log(this.user);
    });
  }

  getCollectionsByUserId() {
    this.collectionServices
      .getCollectionByUserId(this.userId!)
      .subscribe((response) => {
        this.collections = response;
        console.log(this.collections);
      });
  }

  addCollection(userId: string): void{
    this.router.navigate(['/add-collection', userId]);
  }

  // route to collection details page
  goToCollectionDetails(collectionId: string): void {
    this.router.navigate(['/collection-detail', collectionId]);
  }
}

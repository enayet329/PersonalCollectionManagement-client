import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { Collection } from '../../core/model/collection.mode.';
import { CollectionService } from '../../core/services/collection.service';
import { Item } from '../../core/model/item.model';
import { ItemService } from '../../core/services/item.service';
import { ToastrService } from 'ngx-toastr';
import { JwtDecoderService } from '../../core/services/jwt-decoder.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  collections: Collection[] = [];
  recentItems: Item[] = [];
  isLoadingCollections: boolean = true;
  isLoadingItems: boolean = true;

  //user state variables
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  isUser: string = '';

  constructor(
    private collectionService: CollectionService,
    private itemService: ItemService,
    private router: Router,
    private toastr: ToastrService,
    private jwtDecoder: JwtDecoderService
  ) {}

  ngOnInit(): void {
    this.loadCollections();
    this.loadRecentItems();
    this.initializeUserState();
  }

  initializeUserState(): void {
    const token = localStorage.getItem('token');
    if (token && token !== 'null') {
      this.isLoggedIn = true;
      this.isAdmin = this.jwtDecoder.getIsAdminFromToken(token);
      this.isUser = this.jwtDecoder.getUserIdFromToken(token)!;
    } else {
      this.isLoggedIn = false;
      this.isAdmin = false;
      this.isUser = '';
    }
  }

  private loadCollections(): void {
    this.collectionService.getLatestCollections().subscribe(
      (collections) => {
        this.isLoadingCollections = false;
        this.collections = collections;
      },
      (error) => {
        console.error('Error fetching collections', error);
        this.toastr.error('Failed to load collections');
      }
    );
  }

  private loadRecentItems(): void {
    this.itemService.getRecentItems().subscribe(
      (items) => {
        this.recentItems = items;
        this.isLoadingItems = false;
      },
      (error) => {
        console.error('Error fetching items', error);
        this.toastr.error('Failed to load recent items');
      }
    );
  }

  showMoreItems(): void {
    this.router.navigate(['/item-list']);
  }

  goToUserProfile(userId: string): void {
    this.router.navigate(['/profile-view', userId]);
  }

  getLimitedTags(tags: string[], limit: number): string[] {
    return tags.slice(0, limit);
  }

  goToCollectionDetails(collectionId: string): void {
      this.router.navigate(['/collection-detail', collectionId]);
  }

  goToItemDetails(itemId: string): void {
      this.router.navigate(['/item-detail', itemId]);
  }
}

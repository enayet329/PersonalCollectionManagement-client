import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CollectionService } from '../../../core/services/collection.service';
import { Collection } from '../../../core/model/collection.mode.';
import { ItemService } from '../../../core/services/item.service';
import { Item } from '../../../core/model/item.model';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { JwtDecoderService } from '../../../core/services/jwt-decoder.service';
import { ResponseModel } from '../../../core/model/response.model';
import { Location } from '@angular/common';
   

@Component({
  selector: 'app-collection-detail',
  standalone: true,
  imports: [CommonModule, NgbDropdownModule, RouterModule],
  templateUrl: './collection-detail.component.html',
  styleUrls: ['./collection-detail.component.css'],
})
export class CollectionDetailComponent implements OnInit {
  collectionId: string = '';
  collection: Collection | undefined;
  items: Item[] = [];
  paginatedItems: Item[] = [];
  
  // Pagination variables
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 0;

  // User state
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  currentUser: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private collectionService: CollectionService,
    private itemService: ItemService,
    private toaster: ToastrService,
    private jwtDecoder: JwtDecoderService
  ) {}

  ngOnInit(): void {
    this.initializeUserState();
    this.collectionId = this.route.snapshot.paramMap.get('id')!;
    this.getCollection();
    this.getItemsByCollectionId();
  }

  initializeUserState(): void {
    const token = localStorage.getItem('token');
    if (token && !this.jwtDecoder.isTokenExpired(token)) {
      this.currentUser = this.jwtDecoder.getUserIdFromToken(token)!;
      this.isLoggedIn = true;
      this.isAdmin = this.jwtDecoder.getIsAdminFromToken(token)!;
    } else {
      this.isLoggedIn = false;
      this.isAdmin = false;
      this.currentUser = '';
    }
  }

  private getCollection(): void {
    this.collectionService.getCollectionById(this.collectionId).subscribe(
      (collection) => {
        this.collection = collection;
      },
      (error) => {
        console.error('Error fetching collection:', error);
        this.toaster.error('Error fetching collection details');
      }
    );
  }

  private getItemsByCollectionId(): void {
    this.itemService.getItemByCollectionId(this.collectionId).subscribe(
      (items) => {
        this.items = items;
        this.totalPages = Math.ceil(items.length / this.itemsPerPage);
        this.currentPage = this.totalPages > 0 ? 1 : 0;
        this.paginateItems();
      },
      (error) => {
        console.error('Error fetching items:', error);
        this.items = [];
        this.totalPages = 0;
        this.currentPage = 0;
        this.paginatedItems = [];
      }
    );
  }

  private paginateItems(): void {
    if (this.items.length === 0) {
      this.paginatedItems = [];
      return;
    }
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedItems = this.items.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.paginateItems();
    }
  }

  editCollection(collection: Collection): void {
    if (this.isAdmin || (this.isLoggedIn && this.currentUser === this.collection?.userId)) {
      this.router.navigate(['/edit-collection', collection.id]);
    } else {
      this.toaster.warning('You do not have permission to edit this collection');
    }
  }
  deleteCollection(collection: Collection): void {
    if (this.isAdmin || (this.isLoggedIn && this.currentUser === collection.userId)) {
      if (confirm('Are you sure you want to delete this collection? This action cannot be undone.')) {
        this.collectionService.deleteCollection(collection.id).subscribe(
          (response: ResponseModel) => {
            if (response.success) {
              this.toaster.success('Collection deleted successfully');
              this.router.navigate(['/profile-view', this.currentUser]);
            } else {
              this.toaster.error('Error deleting collection');
            }
          },
          (error) => {
            console.error('Error deleting collection:', error);
            this.toaster.error('Error deleting collection');
          }
        );
      }
    } else {
      this.toaster.warning('You do not have permission to delete this collection');
    }
  }

  handleAction(event: Event, action: string, item: Item): void {
    event.stopPropagation();
    if (action === 'edit') {
      this.editItem(item);
    } else if (action === 'delete') {
      this.deleteItem(item);
    }
  }

  addNewItem(): void {
    if (this.isAdmin || this.isLoggedIn) {
      this.router.navigate(['/add-item', this.collectionId]);
    } else {
      this.toaster.warning('Please log in to add a new item');
    }
  }

  editItem(item: Item): void {
    if (this.isAdmin || (this.isLoggedIn && this.currentUser === this.collection?.userId)) {
      this.router.navigate(['/edit-item', item.id]);
    } else {
      this.toaster.warning('You do not have permission to edit this item');
    }
  }

  deleteItem(item: Item): void {
    if (this.isAdmin || (this.isLoggedIn && this.currentUser === this.collection?.userId)) {
      this.itemService.deleteItemById(item.id).subscribe(
        (response: ResponseModel) => {
          if (response.success) {
            this.getItemsByCollectionId(); 
            this.toaster.success('Item deleted successfully');
          } else {
            this.toaster.error('Error deleting item');
          }
        },
        (error) => {
          console.error('Error deleting item:', error);
          this.toaster.error('Error deleting item');
        }
      );
    } else {
      this.toaster.warning('You do not have permission to delete this item');
    }
  }

  navigateToDetail(itemId: string): void {
    if (this.isLoggedIn) {
      this.router.navigate(['/item-detail', itemId]);
    } else {
      this.toaster.warning('Please log in to view item details');
    }
  }
}
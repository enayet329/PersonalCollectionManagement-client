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

  //user state
  isLoggedIn: boolean = true;
  isAdmin: boolean = false;
  currentUser: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private collectionService: CollectionService,
    private itemService: ItemService,
    private toaster: ToastrService,
    private jwtDecoder: JwtDecoderService
  ) {}

  ngOnInit(): void {
    this.initializeUserState();
    this.collectionId = this.route.snapshot.paramMap.get('id')!;
    console.log(this.collectionId);
    this.getCollection();
    this.getItemsByCollectionId();
  }

  initializeUserState(): void {
    const token = localStorage.getItem('token');
    if(token && !this.jwtDecoder.isTokenExpired(token))
    {
      this.currentUser = this.jwtDecoder.getUserIdFromToken(token)!;

      this.isLoggedIn = true;
      this.isAdmin = this.jwtDecoder.getIsAdminFromToken(token)!;
    }
    else{
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
        console.error(error);
      }
    );
  }

  private getItemsByCollectionId(): void {
    this.itemService.getItemByCollectionId(this.collectionId).subscribe(
      (items) => {
        this.items = items;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  editCollection(collection: any) {
    console.log('Editing collection:', collection);
  }

  deleteCollection(collection: any) {
    console.log('Deleting collection:', collection);
  }

  handleAction(event: Event, action: string, item: any): void {
    event.stopPropagation();
    if (action === 'edit') {
      this.editItem(item);
    } else if (action === 'delete') {
      this.deleteItem(item);
    }
  }

  addNewItem(collectionId: any): void {
    this.router.navigate(['/add-item', this.collectionId]);
  }

  editItem(item: any): void {
    console.log('Edit item:', item);
  }

  deleteItem(item: any): void {
    console.log('Delete item:', item);
  }

  navigateToDetail(itemId: string): void {
    this.router.navigate(['/item-detail', itemId]);
  }


}
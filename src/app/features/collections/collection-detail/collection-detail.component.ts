import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CollectionService } from '../../../core/services/collection.service';
import { Collection } from '../../../core/model/collection.mode.';
import { ItemService } from '../../../core/services/item.service';
import { Item } from '../../../core/model/item.model';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

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
  isLoggedIn: boolean = true;
  isAdmin: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private collectionService: CollectionService,
    private itemService: ItemService,
    private toaster: ToastrService,
  ) {}

  ngOnInit(): void {
    this.collectionId = this.route.snapshot.paramMap.get('id')!;
    console.log(this.collectionId);
    this.getCollection();
    this.getItemsByCollectionId();
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
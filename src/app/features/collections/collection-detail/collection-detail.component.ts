import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CollectionService } from '../../../core/services/collection.service';
import { Collection } from '../../../core/model/collection.mode.';
import { ItemService } from '../../../core/services/item.service';
import { Item } from '../../../core/model/item.model';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-collection-detail',
  standalone: true,
  imports: [CommonModule, NgbDropdownModule, RouterLink],
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
    private itemService: ItemService
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
    // Implement the logic to edit the collection
    console.log('Editing collection:', collection);
  }

  deleteCollection(collection: any) {
    // Implement the logic to delete the collection
    console.log('Deleting collection:', collection);
  }

  editItem(item: any) {
    // Implement the logic to edit the item
    console.log('Editing item:', item);
  }

  deleteItem(item: any) {
    // Implement the logic to delete the item
    console.log('Deleting item:', item);
  }
}

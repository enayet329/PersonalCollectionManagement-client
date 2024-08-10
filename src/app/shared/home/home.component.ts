import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { Collection } from '../../core/model/collection.mode.';
import { CollectionService } from '../../core/services/collection.service';
import { Item } from '../../core/model/item.model';
import { ItemService } from '../../core/services/item.service';
import { ToastrService } from 'ngx-toastr';

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

  constructor(
    private collectionService: CollectionService,
    private itemService: ItemService,
    private router: Router,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.loadCollections();
    this.loadRecentItems();
  }

  private loadCollections(): void {
    this.collectionService.getLatestCollections().subscribe(
      (collections) => {
        this.collections = collections;
        console.log(this.collections);
      },
      (error) => {
        console.error('Error fetching collections', error);
      }
    );
  }

  private loadRecentItems(): void {
    this.itemService.getRecentItems().subscribe(
      (items) => {
        this.recentItems = items;
        console.log('Recent Items:', this.recentItems);
      },
      (error) => {
        console.error('Error fetching items', error);
      }
    );
  }

  getLimitedTags(tags: string[], limit: 3): string[] {
    return tags.slice(0, limit);
  }

  goToCollectionDetails(collectionId: string) {
    this.router.navigate(['/collection-detail', collectionId]);
  }

  goToItemDetails(itemId: string) {
    this.router.navigate(['/item-detail', itemId]);
  }
}

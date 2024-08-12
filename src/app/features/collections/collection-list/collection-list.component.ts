import { Component, OnInit } from '@angular/core';
import { Collection } from '../../../core/model/collection.mode.';
import { CollectionService } from '../../../core/services/collection.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-collection-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './collection-list.component.html',
  styleUrl: './collection-list.component.css',
})
export class CollectionListComponent implements OnInit {

  collections: Collection[] = [];

  constructor(private collectionService: CollectionService,    private router: Router) {}

  ngOnInit(): void {
    this.collectionService.getCollections().subscribe((data) => {
      this.collections = data;
    });
  }

  goToCollectionDetails(collectionId: string) {
    this.router.navigate(['/collection-detail', collectionId]);
    }
}

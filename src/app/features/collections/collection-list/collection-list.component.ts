import { Component, OnInit } from '@angular/core';
import { Collection } from '../../../core/model/collection.mode.';
import { CollectionService } from '../../../core/services/collection.service';
import { CommonModule } from '@angular/common';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterModule,
} from '@angular/router';
import { JwtDecoderService } from '../../../core/services/jwt-decoder.service';
import { ToastrService } from 'ngx-toastr';
import { ResponseModel } from '../../../core/model/response.model';

@Component({
  selector: 'app-collection-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './collection-list.component.html',
  styleUrl: './collection-list.component.css',
})
export class CollectionListComponent implements OnInit {
  collections: Collection[] = [];
  currentUser: string = '';

  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  isLoading: boolean = true;

  constructor(
    private collectionService: CollectionService,
    private router: Router,
    private jwtDecoder: JwtDecoderService,
    private toaster: ToastrService,
  ) {}

  ngOnInit(): void {
    this.getAllCollections();
    this.initializeUserState();
  }

  initializeUserState() {
    const token = localStorage.getItem('token');
    if (token && token !== 'null') {
      this.isLoggedIn = true;
      this.isAdmin = this.jwtDecoder.getIsAdminFromToken(token);
    }
  }

  getAllCollections() {
    this.collectionService.getCollections().subscribe((data) => {
      this.isLoading = false;
      this.collections = data;
    },(error) => { 
      console.error('Error getting collections:', error);
    }
  );
}

  updateCollection(collectionId: string): void {
    this.router.navigate(['/edit-collection', collectionId]);
  }

  deleteCollection(collection: Collection) {
    if (
      this.isAdmin ||
      (this.isLoggedIn && this.currentUser === collection.userId)
    ) {
      if (
        confirm(
          'Are you sure you want to delete this collection? This action cannot be undone.'
        )
      ) {
        this.collectionService.deleteCollection(collection.id).subscribe(
          (response: ResponseModel) => {
            if (response.success) {
              this.toaster.success('Collection deleted successfully');
              this.getAllCollections();
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
      this.toaster.warning(
        'You do not have permission to delete this collection'
      );
    }
  }
  
  goToUserProfile(userId: string): void {
    this.router.navigate(['/profile-view', userId]);
  }
  goToCollectionDetails(collectionId: string) {
    this.router.navigate(['/collection-detail', collectionId]);
  }
}

import { Component, OnInit } from '@angular/core';
import { Collection } from '../../../core/model/collection.mode.';
import { CollectionService } from '../../../core/services/collection.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { JwtDecoderService } from '../../../core/services/jwt-decoder.service';

@Component({
  selector: 'app-collection-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './collection-list.component.html',
  styleUrl: './collection-list.component.css',
})
export class CollectionListComponent implements OnInit {

  collections: Collection[] = [];
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  isLoading: boolean = true;

  constructor(private collectionService: CollectionService,    private router: Router, private jwtDecoder: JwtDecoderService) {}

  ngOnInit(): void {
    this.collectionService.getCollections().subscribe((data) => {
      this.isLoading = false;
      this.collections = data;
    });
    this.initializeUserState();
  }

  initializeUserState(){
    const token = localStorage.getItem('token');
    if(token)
    {
      this.isLoggedIn = true;
      this.isAdmin = this.jwtDecoder.getIsAdminFromToken(token);
    }
  }

  updateCollection(collectionId:string): void {
    console.log( 'updateCollections called with collectionId: ', collectionId);
  }
  deleteCollection(collectionId:string){
    console.log( 'deleteCollection called with collectionId: ', collectionId);
  }
  goToUserProfile(userId: string): void {
      this.router.navigate(['/profile-view', userId]);
  }
  goToCollectionDetails(collectionId: string) {
      this.router.navigate(['/collection-detail', collectionId]);
  }
}

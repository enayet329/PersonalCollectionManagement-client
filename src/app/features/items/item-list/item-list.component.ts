import { Component, OnInit } from '@angular/core';
import { Item } from '../../../core/model/item.model';
import { ItemService } from '../../../core/services/item.service';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { JwtDecoderService } from '../../../core/services/jwt-decoder.service';

@Component({
  selector: 'app-item-list',
  standalone: true,
  imports: [DatePipe, CommonModule, RouterLink],
  templateUrl: './item-list.component.html',
  styleUrl: './item-list.component.css',
})
export class ItemListComponent implements OnInit {
  items: Item[] = [];
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;

  constructor(
    private itemService: ItemService,
    private router: Router,
    private jwtDecoder: JwtDecoderService
  ) {}

  ngOnInit(): void {
    this.getAllItems();
    this.initializeUserState();
  }


  initializeUserState(){
    const token = localStorage.getItem('token');
    if(token && !this.jwtDecoder.isTokenExpired(token)){
      this.isLoggedIn = true;
      this.isAdmin = this.jwtDecoder.getIsAdminFromToken(token);
    }
  }

  getAllItems(): void {
    this.itemService.getAllItems().subscribe((response: Item[]) => {
      this.items = response;
      console.log('Items fetched successfully', this.items);
    });
  }

  goToItemDetails(itemId: string): void {
    if(this.isLoggedIn){
      this.router.navigate(['/item-detail', itemId]);
    }
  }

  getLimitedTags(tagNames: string[], limit: number = 3): string[] {
    return tagNames.slice(0, limit);
  }
}

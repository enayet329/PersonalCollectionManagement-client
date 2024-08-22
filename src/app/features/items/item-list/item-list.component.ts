import { Component, OnInit } from '@angular/core';
import { Item } from '../../../core/model/item.model';
import { ItemService } from '../../../core/services/item.service';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { JwtDecoderService } from '../../../core/services/jwt-decoder.service';
import { ResponseModel } from '../../../core/model/response.model';
import { ToastrService } from 'ngx-toastr';
import { EditItemComponent } from '../edit-item/edit-item.component';

@Component({
  selector: 'app-item-list',
  standalone: true,
  imports: [DatePipe, CommonModule, RouterLink],
  templateUrl: './item-list.component.html',
  styleUrl: './item-list.component.css',
})
export class ItemListComponent implements OnInit {
  items: Item[] = [];
  loadingItems: boolean = true;

  //user state variables
  isLoggedIn: boolean = true;
  isAdmin: boolean = false;
  userId: string = '';

  constructor(
    private itemService: ItemService,
    private router: Router,
    private jwtDecoder: JwtDecoderService,
    private toaster: ToastrService,
  ) {}

  ngOnInit(): void {
    this.getAllItems();
    this.initializeUserState();
  }


  initializeUserState(){
    const token = localStorage.getItem('token');
    if(token && token !== 'null'){
      this.isLoggedIn = true;
      this.isAdmin = this.jwtDecoder.getIsAdminFromToken(token);
      this.userId = this.jwtDecoder.getUserIdFromToken(token)!;
    }
  }

  getAllItems(): void {
    this.itemService.getAllItems().subscribe((response: Item[]) => {
      this.items = response;
      console.log('Items fetched successfully', this.items);
      this.loadingItems = false;
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

  updateItem(itemId: string): void {
    this.router.navigate(['/edit-item', itemId]);
  }

  deleteItem(item: Item): void {
    if(this.isAdmin || item.userId === this.userId){
      if (confirm('Are you sure you want to delete this item?')) {
        this.itemService.deleteItemById(item.id).subscribe(
          (response: ResponseModel) => {
            if (response.success) {
              this.toaster.success('Item deleted successfully', 'Success');
              this.getAllItems();
            } else {
              this.toaster.error('Failed to delete item', 'Error');
              console.error('Failed to delete item', response.message);
            }
          }
        )
      }
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-item-detail',
  standalone: true,
  imports: [],
  templateUrl: './item-detail.component.html',
  styleUrl: './item-detail.component.css'
})
export class ItemDetailComponent implements OnInit{
  itemId: string = '';
  constructor(private route: ActivatedRoute){}

  ngOnInit(): void {
      this.itemId = this.route.snapshot.paramMap.get('id')!;
  }
}

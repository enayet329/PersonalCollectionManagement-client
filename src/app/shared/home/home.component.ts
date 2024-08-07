import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  collections = [
    {
      id: 1,
      name: 'Antique Vases',
      category: 'Antiques',
      itemsCount: 15,
      imageUrl: '/assets/antique_vases.jpg',
      creator: { id: 1, name: 'John Doe' },
      createdAt: new Date('2023-06-15T09:24:00')
    },
    // Add more collection objects here
  ];

  recentItems = [
    {
      id: 1,
      name: 'Vintage Vase',
      category: 'Antiques',
      imageUrl: '/assets/vintage_vase.jpg',
      collectionId: 1,
      addedBy: { id: 1, name: 'John Doe' },
      addedAt: new Date('2024-08-01T12:34:00')
    },
    // Add more item objects here
  ];
}

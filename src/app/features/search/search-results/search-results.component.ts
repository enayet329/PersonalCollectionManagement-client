import { Component, inject } from '@angular/core';
import { Item } from '../../../core/model/item.model';
import { SearchService } from '../../../core/services/search.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent {
  items: Item[] = [];
  query: string = '';

  constructor(
    private searchService: SearchService,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe(params => {
      this.query = params['query'];
      this.onSearch();
    });
  }

  onSearch() {
    if (this.query.trim()) {
      this.searchService.search(this.query).subscribe(items => {
        this.items = items;
      });
    }
  }

  getLimitedTags(tags: string[], limit: number): string[] {
    return tags.slice(0, limit);
  }
}
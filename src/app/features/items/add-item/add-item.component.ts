import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemService } from '../../../core/services/item.service';
import { CustomFieldService } from '../../../core/services/custom-field.service';

@Component({
  selector: 'app-add-item',
  standalone: true,
  imports: [],
  templateUrl: './add-item.component.html',
  styleUrl: './add-item.component.css',
})
export class AddItemComponent {

  constructor(
    private router: Router,
    private route : ActivatedRoute,
    private itemService: ItemService,
    private customFieldValue: CustomFieldService
  ) {}

  ngOnInit() {
    this.route.snapshot.paramMap.get('id');
  }

  

}

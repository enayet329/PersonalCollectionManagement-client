import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { JwtDecoderService } from '../../../core/services/jwt-decoder.service';
import { ToastrService } from 'ngx-toastr';
import { ItemService } from '../../../core/services/item.service';
import { TagService } from '../../../core/services/tag.service';
import { CustomFieldService } from '../../../core/services/custom-field.service';
import { Item } from '../../../core/model/item.model';
import { CustomFieldResponse } from '../../../core/model/customField.model';
import { CustomFieldValueResponse, updateCustomFieldValueRequest } from '../../../core/model/customFieldValue.model';
import { AddTagResponse } from '../../../core/model/tag.model';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
  selector: 'app-edit-item',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './edit-item.component.html',
  styleUrl: './edit-item.component.css',
})
export class EditItemComponent implements OnInit {

  updateItemForm!: FormGroup;
  
  //data state
  items: Item[] = [];
  selectedItem: Item = {} as Item;
  tags: AddTagResponse[] = [];
  selectedTags: AddTagResponse[] = [];
  customFieldValues: CustomFieldResponse[] = [];
  updateCustomFields: updateCustomFieldValueRequest[] = [];
  selectedCustomFields: CustomFieldValueResponse[] = [];


  //user state
  userId: string = '';
  isAdmin: boolean = false;
  prefferedTheme: string = '';
  isLoggedIn: boolean = false;
  isClicked: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private jwtDecoder: JwtDecoderService,
    private toaster: ToastrService,
    private itemService: ItemService,
    private tagService: TagService,
    private custmFieldService: CustomFieldService,
    private fb: FormBuilder
    
  ) {}

  ngOnInit(): void {
    console.log('EditItemComponent', this.route.snapshot.paramMap.get('id'));
  }

  initializeForm() {
    this.updateItemForm = this.fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      collecitonId: ['', Validators.required],
      customFields: this.fb.array([]),
      tags: this.fb.array([])
    });
  }

  


}

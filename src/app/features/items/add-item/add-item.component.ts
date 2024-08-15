import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemService } from '../../../core/services/item.service';
import { CustomFieldService } from '../../../core/services/custom-field.service';
import { CustomFieldResponse } from '../../../core/model/customField.model';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TagService } from '../../../core/services/tag.service';
import { AddTagRequest, AddTagResponse } from '../../../core/model/tag.model';
import { AddItem, Item } from '../../../core/model/item.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CustomFieldValue } from '../../../core/model/customFieldValue.model';
import { CustomFieldValueService } from '../../../core/services/custom-field-value.service';
import { CloudinaryUploadService } from '../../../core/services/image-upload.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-item',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css'],
})
export class AddItemComponent implements OnInit {
  addItemForm!: FormGroup;
  collectionId: string = '';
  customFields: CustomFieldResponse[] = [];
  tags: AddTagResponse[] = [];
  selectedTags: AddTagResponse[] = [];
  customFieldValues: CustomFieldValue[] = [];
  item: Item = {} as Item;
  private itemImageFile: File | null = null;
  public itemImageUrl: SafeUrl | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private itemService: ItemService,
    private customFieldService: CustomFieldService,
    private customFieldValuesService: CustomFieldValueService,
    private tagService: TagService,
    private cloudinaryService: CloudinaryUploadService,
    private toaster: ToastrService
  ) {}

  ngOnInit(): void {
    this.collectionId = this.route.snapshot.paramMap.get('id')!;
    this.initializeForm();
    this.getCustomFields();
    this.getAllTags();
  }

  initializeForm(): void {
    this.addItemForm = this.fb.group({
      name: ['', [Validators.required]],
      imgUrl: [null],
      description: [''],
      collectionId: [this.collectionId, [Validators.required]],
      customFields: this.fb.array([]),
      tags: this.fb.array([]),
    });
  }
  get customFieldsArray(): FormArray {
    return this.addItemForm.get('customFields') as FormArray;
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy';
    }
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file) {
      this.itemImageFile = file;
      this.updateItemImageUrl();
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.itemImageFile = file;
      this.updateItemImageUrl();
    }
  }
  // update item image url
  private updateItemImageUrl(): void {
    if (this.itemImageFile) {
      const url = this.sanitizer.bypassSecurityTrustUrl(
        window.URL.createObjectURL(this.itemImageFile)
      );
      this.itemImageUrl = url;
    }
  }

  // add custom fields to form
  addCustomFieldsToForm(): void {
    this.customFields.forEach((field) => {
      const control = this.fb.group({
        id: [field.id],
        name: [field.name],
        fieldType: [field.fieldType],
        value: [null],
        collectionId: [field.collectionId],
      });
      this.customFieldsArray.push(control);
    });
  }

  
  //get tag and custom field data from server
  getCustomFields(): void {
    this.customFieldService
      .getCustomFieldsByCollectionId(this.collectionId)
      .subscribe(
        (response: CustomFieldResponse[]) => {
          this.customFields = response;
          console.log('customFields', this.customFields);
          this.addCustomFieldsToForm();
        },
        (error: any) => {
          console.error(error);
        }
      );
  }


  getAllTags(): void {
    this.tagService.getAllTags().subscribe(
      (response: AddTagResponse[]) => {
        this.tags = response;
        console.log('tags', this.tags);
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  // add tag to selected tags array
  createTags(tag: AddTagResponse): void {
    if (!this.selectedTags.some((t) => t.id === tag.id)) {
      this.selectedTags.push(tag);
      this.addItemForm.patchValue({ tags: this.selectedTags });
    }
  }

  // get selected tags array
  get tagsArray(): FormArray {
    return this.addItemForm.get('tags') as FormArray;
  }


  // remove tag from selected tags array
  toggleTagSelection(tagId: string): void {
    const tag = this.tags.find((t) => t.id === tagId);
    if (tag) {
      const index = this.selectedTags.findIndex((t) => t.id === tagId);
      if (index >= 0) {
        this.selectedTags.splice(index, 1);
        this.tagsArray.removeAt(index);
      } else {
        this.selectedTags.push(tag);
        this.tagsArray.push(this.fb.control(tag));
      }
    }
  }

  removeTag(tag: AddTagResponse): void {
    this.selectedTags = this.selectedTags.filter((t) => t.id !== tag.id);
    this.addItemForm.patchValue({ tags: this.selectedTags });
    this.addItemForm.updateValueAndValidity();
  }


  addCustomTag(tagName: string): void {
    const trimmedTagName = tagName.trim();
    if (
      trimmedTagName &&
      !this.selectedTags.some(
        (tag) => tag.name.toLowerCase() === trimmedTagName.toLowerCase()
      )
    ) {
      const newTag: AddTagResponse = {
        id: Date.now().toString(),
        name: trimmedTagName,
      };
      this.selectedTags.push(newTag);
      this.tagsArray.push(this.fb.control(newTag));
      this.addItemForm.updateValueAndValidity();
    }
  }


  // add item to server
  addItem(imageUrl: string): void {
    if (this.addItemForm.valid) {
      const formValue = this.addItemForm.value;

      const itemData: AddItem = {
        name: formValue.name,
        imgUrl: imageUrl,
        description: formValue.description,
        collectionId: formValue.collectionId,
      };

      this.itemService.addItem(itemData).subscribe(
        (response: any) => {
          if (response.id) {
            this.toaster.success('Item added successfully', 'Success');
            const itemId = response.id;
            this.addCustomField(itemId);
            this.addTag(itemId);          
            this.router.navigate(['/collection-detail', this.collectionId]);
          }
        },
        (error: any) => {
          console.error(error);
        }
      );
    } else {
      console.log('Form is invalid, cannot submit');
    }
  }

  // end of add item to server

  // add custom field to server
  addCustomField(itemId: string): void {
    const customFieldData: CustomFieldValue[] =
      this.addItemForm.value.customFields.map((field: any) => ({
        value: field.value ? field.value.toString() : null,
        customFieldId: field.id,
        itemId: itemId,
      }));
    console.log('customFieldData', customFieldData);
    this.customFieldValuesService
      .addCustomFieldValue(customFieldData)
      .subscribe(
        (response: any) => {
          if (response.length > 0) {
            console.log('Custom field added successfully');
          } else {
            console.log('Custom field not added');
          }
        },
        (error: any) => {
          console.error(error);
        }
      );
  }

  // add tage to server
  addTag(itemId: string): void {
    const tagData: AddTagRequest[] = this.addItemForm.value.tags.map(
      (tag: any) => ({
        name: tag.name,
        itemId: itemId,
      })
    );

    this.tagService.addTags(tagData).subscribe(
      (response: any) => {
        console.log(response);
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  // end of add custom field to server

  onSubmit(): void {
    if (this.addItemForm.valid) {
      if (this.itemImageFile) {
        this.cloudinaryService.uploadImage(this.itemImageFile!).then(
          (url: string) => {
            this.addItem(url);
          },
          (error: any) => {
            console.error(error);
          }
        );
      } else {
        this.addItem('');
      }
    } else {
      console.log('Form is invalid:');
      if (this.addItemForm.errors?.['tagsInvalid']) {
        console.log('- Tags are invalid or missing');
      }
      if (this.addItemForm.errors?.['customFieldsInvalid']) {
        console.log('- Custom fields are invalid or missing');
      }
    }
  }
}

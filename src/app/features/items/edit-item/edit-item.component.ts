import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { JwtDecoderService } from '../../../core/services/jwt-decoder.service';
import { ToastrService } from 'ngx-toastr';
import { ItemService } from '../../../core/services/item.service';
import { TagService } from '../../../core/services/tag.service';
import { Item, UpdateItem } from '../../../core/model/item.model';
import {
  CustomFieldValue,
  CustomFieldValueResponse,
  updateCustomFieldValueRequest,
} from '../../../core/model/customFieldValue.model';
import { AddTagResponse } from '../../../core/model/tag.model';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CustomFieldValueService } from '../../../core/services/custom-field-value.service';
import { ThemeService } from '../../../core/services/theme.service';
import { CustomFieldResponse } from '../../../core/model/customField.model';
import { Location } from '@angular/common';
import { CloudinaryUploadService } from '../../../core/services/image-upload.service';
import { v4 as uuidv4, validate } from 'uuid';

@Component({
  selector: 'app-edit-item',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './edit-item.component.html',
  styleUrl: './edit-item.component.css',
})
export class EditItemComponent implements OnInit {
  updateItemForm!: FormGroup;

  // Data state
  selectedItem: Item = {} as Item;
  selectedTags: AddTagResponse[] = [];
  selectedCustomFields: CustomFieldValueResponse[] = [];
  updateItemImageFile: File | null = null;
  updateItemImageUrl: SafeUrl | null = '';
  itemId: string | null = null;
  collectionId: string = '';
  customFields: CustomFieldResponse[] = [];
  tags: AddTagResponse[] = [];
  updateCustomFieldValues: updateCustomFieldValueRequest[] = [];
  item: Item = {} as Item;
  updateItemEntity: UpdateItem = {} as UpdateItem;
  private itemImageFile: File | null = null;
  public itemImageUrl: SafeUrl | null = null;
  isClicked: boolean = false;
  isLoggedIn: boolean = false;

  // user state
  userId: string | null = null;
  isAdmin: boolean = false;
  isUserLoggedIn: boolean = false;
  isUser: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private jwtDecoder: JwtDecoderService,
    private toaster: ToastrService,
    private location: Location,
    private itemService: ItemService,
    private tagService: TagService,
    private custmFieldServiceValues: CustomFieldValueService,
    private themeService: ThemeService,
    private cloudinaryService: CloudinaryUploadService
  ) {}

  ngOnInit(): void {
    this.itemId = this.route.snapshot.paramMap.get('id');
    this.initializeForm();
    this.loadItemData();
  }

  initializeForm() {
    this.updateItemForm = this.fb.group({
      id: [''],
      name: ['',[Validators.required]],
      imgUrl: [''],
      description: [''],
      collectionId: [''],
      tags: this.fb.array([]),
      customFields: this.fb.array([]),
    });
  }

  // Getter for tags FormArray
  get tagsArray(): FormArray {
    return this.updateItemForm.get('tags') as FormArray;
  }

  // Getter for customFields FormArray
  get customFieldsArray(): FormArray {
    return this.updateItemForm.get('customFields') as FormArray;
  }

  // Load item data including tags and custom fields
  loadItemData() {
    this.itemId = this.route.snapshot.paramMap.get('id');
    if (this.itemId) {
      this.itemService.getItemById(this.itemId).subscribe((item: Item) => {
        this.selectedItem = item;

        this.updateItemImageUrl = this.selectedItem.imgUrl;
        this.collectionId = this.selectedItem.collectionId;

        this.updateItemForm.patchValue({
          id: item.id,
          name: item.name,
          imgUrl: item.imgUrl,
          description: item.description,
          collectionId: item.collectionId,
        });
        this.loadCustomFields(this.itemId!);
        this.loadedAllTags();
        this.loadTags(this.itemId!);
      });
    } else {
      console.log('No item id provided');
    }
  }

  loadedAllTags() {
    this.tagService.getAllTags().subscribe(
      (tags: AddTagResponse[]) => {
        this.tags = tags;
        console.log('All tags loaded', tags);
        this.populateTags(tags);
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  loadTags(itemId: string) {
    this.tagService
      .getTagsByItemId(itemId)
      .subscribe((tags: AddTagResponse[]) => {
        this.selectedTags = tags;
        this.populateTags(tags);
      });
  }

  // Populate the tags FormArray
  populateTags(tags: AddTagResponse[]) {
    this.selectedTags.forEach((tag) => {
      this.tagsArray.push(
        this.fb.group({
          id: [tag.id],
          name: [tag.name],
        })
      );
    });
  }

  // Load custom fields for the item
  loadCustomFields(itemId: string) {
    this.custmFieldServiceValues
      .getCustomFieldValueByItemId(itemId)
      .subscribe((customFields: CustomFieldValueResponse[]) => {
        this.selectedCustomFields = customFields;
        this.populateCustomFields(customFields);
      }),
      (error: any) => {
        console.log('CustomField error', error);
      };
  }

  // Populate the customFields FormArray
  populateCustomFields(customFields: CustomFieldValueResponse[]) {
    customFields.forEach((field) => {
      this.customFieldsArray.push(
        this.fb.group({
          id: [field.id],
          value: [field.value],
          customFieldId: [field.customFieldId],
          itemId: [field.itemId],
          customFieldName: [field.customFieldName],
          fieldType: [field.fieldType],
        })
      );
    });
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
        id: uuidv4(),
        name: trimmedTagName,
      };
      this.selectedTags.push(newTag);
      this.tagsArray.push(this.fb.control(newTag));
      this.updateItemForm.updateValueAndValidity();
    }
  }

  removeTag(tag: AddTagResponse): void {
    this.selectedTags = this.selectedTags.filter((t) => t.id !== tag.id);
    this.updateItemForm.patchValue({ tags: this.selectedTags });
    this.updateItemForm.updateValueAndValidity();
  }

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

  // Handle file drag and drop
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy';
    }
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer) {
      this.updateItemImageFile = event.dataTransfer.files[0];
      this.updateImagePreview();
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.updateItemImageFile = input.files[0];
      this.updateImagePreview();
    }
  }

  private updateImagePreview(): void {
    if (this.updateItemImageFile) {
      const url = this.sanitizer.bypassSecurityTrustUrl(
        window.URL.createObjectURL(this.updateItemImageFile)
      );
      this.updateItemImageUrl = url;
    }
  }

  onSubmit(): void {
    if (this.updateItemForm.invalid) {
      this.toaster.error('Please fill in all required fields.');
      return;
    }

    this.isClicked = true;

    if (this.updateItemImageFile) {
      this.cloudinaryService
        .uploadImage(this.updateItemImageFile)
        .then((url: string) => {
          this.updateItemImageUrl = url;
          this.updateItem();
        })
        .catch((error) => {
          console.error('Image upload failed:', error);
        });
    } else {
      this.updateItem();
    }
  }

  updateItem() {
    const updateItem: UpdateItem = {
      id: this.updateItemForm.value.id,
      name: this.updateItemForm.value.name,
      imgUrl: this.updateItemImageUrl
        ? this.updateItemImageUrl.toString()
        : this.updateItemForm.value.imgUrl,
      description: this.updateItemForm.value.description,
      collectionId: this.updateItemForm.value.collectionId,
    };
    console.log('image url', this.updateItemForm.value.imgUrl);
    this.itemService.updateItem(updateItem).subscribe(
      (response: any) => {
        console.log('Item updated successfully');
        this.updateCustomFieldValue();
        this.updateTags();
        this.toaster.success('Item updated successfully');
      },
      (error) => {
        this.toaster.error('Failed to update item');
        console.log(error.message);
      }
    );
  }

  updateCustomFieldValue() {
    const customFieldValues: updateCustomFieldValueRequest[] =
      this.updateItemForm.value.customFields.map((field: any) => {
        return {
          id: field.id,
          value: field.value,
          customFieldId: field.customFieldId,
          itemId: field.itemId,
        };
      });
    console.log('Custom field values', customFieldValues);
    this.custmFieldServiceValues
      .updateCustomFieldValue(customFieldValues)
      .subscribe((response: any) => {
        console.log('Custom field values updated successfully');
      }),
      (error: any) => {
        console.log('Failed to update custom field values', error);
      };
  }

  updateTags() {
    this.tags = this.selectedTags;

    console.log('Tags', this.tags, 'itemId', this.itemId);
    this.tagService
      .updateTag(this.itemId!, this.tags!)
      .subscribe((response: any) => {
        this.router.navigate(['/item-detail', this.itemId!]);
        console.log('Tags updated successfully', response);
      });
  }
}

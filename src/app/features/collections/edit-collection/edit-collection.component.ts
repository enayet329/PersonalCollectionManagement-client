import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtDecoderService } from '../../../core/services/jwt-decoder.service';
import { Categories } from '../../../core/model/categories.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Collection, UpdateCollectionRequest } from '../../../core/model/collection.mode.';
import { CustomFieldResponse, updateCustomFieldRequest } from '../../../core/model/customField.model';
import { CollectionService } from '../../../core/services/collection.service';
import { CustomFieldService } from '../../../core/services/custom-field.service';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { CloudinaryUploadService } from '../../../core/services/image-upload.service';

@Component({
  selector: 'app-edit-collection',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-collection.component.html',
  styleUrls: ['./edit-collection.component.css'],
})
export class EditCollectionComponent implements OnInit {
  editCollectionForm!: FormGroup;
  collectionImageFile: File | null = null;
  collectionUrlImageUrl: SafeUrl | null = null;
  categories: Categories[] = [];
  collection: Collection = {} as Collection;
  customFields: CustomFieldResponse[] = [];
  updateCollectionModel: UpdateCollectionRequest  = {} as UpdateCollectionRequest;
  updateCustomFieldModel: updateCustomFieldRequest[]  =  [];
  isClicked = false;

  // User state
  isAdmin: boolean = false;
  userId: string | null = '';
  isUser: boolean = false;
  currentUser: string | null = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private jwtDecoderService: JwtDecoderService,
    private activeRoute: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private location: Location,
    private collectionService: CollectionService,
    private customFieldService: CustomFieldService,
    private cloudinaryService: CloudinaryUploadService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initializeUserState();
    this.initializeForm();
    this.loadCollectionData();
    this.getCategories();
  }

  private initializeUserState(): void {
    const token = localStorage.getItem('token');
    if (token && !this.jwtDecoderService.isTokenExpired(token)) {
      this.isAdmin = this.jwtDecoderService.getIsAdminFromToken(token);
      this.currentUser = this.jwtDecoderService.getUserIdFromToken(token);
    } else {
      this.isAdmin = false;
      this.userId = null;
    }
  }

  private initializeForm(): void {
    this.editCollectionForm = this.fb.group({
      name: ['', Validators.required],
      userId: [this.userId, Validators.required],
      topic: ['', Validators.required],
      imageUrl: [null],
      description: [''],
      customFields: this.fb.array([]),
      newFieldType: [''],
    });
  }

  private loadCollectionData(): void {
    const collectionId = this.activeRoute.snapshot.paramMap.get('id');
    if (collectionId) {
      this.collectionService.getCollectionById(collectionId).subscribe(
        (response: Collection) => {
          this.collection = response;
          this.patchFormWithCollectionData();
          this.loadCustomFields();
          console.log(this.collection);
        },
        (error) => this.toastr.error('Failed to load collection data.')
      );
    }
  }

  private patchFormWithCollectionData(): void {
    this.editCollectionForm.patchValue({
      name: this.collection.name,
      userId: this.collection.userId,
      topic: this.collection.topic,
      description: this.collection.description,
      imageUrl: this.collection.imageUrl,
    });
  
    if (this.collection.imageUrl) {
      this.collectionUrlImageUrl = this.sanitizer.bypassSecurityTrustUrl(this.collection.imageUrl);
    }
  }
  

  private loadCustomFields(): void {
    this.customFieldService.getCustomFieldsByCollectionId(this.collection.id).subscribe(
      (response: CustomFieldResponse[]) => {
        this.customFields = response;
        this.patchFormWithCustomFields();
        console.log(this.customFields);
      },
      (error) => this.toastr.error('Failed to load custom fields.')
    );
  }

  private patchFormWithCustomFields(): void {
    const customFieldsFormArray = this.editCollectionForm.get('customFields') as FormArray;
    customFieldsFormArray.clear();
  
    this.customFields.forEach(field => {
      customFieldsFormArray.push(this.fb.group({
        label: [field.name, Validators.required],
        fieldType: [field.fieldType, Validators.required],
        value: [field.customFieldValues || ''],
      }));
    });
  }
  

  get customFieldsControls() {
    return (this.editCollectionForm.get('customFields') as FormArray).controls;
  }

  addCustomField(): void {
    const customFields = this.editCollectionForm.get('customFields') as FormArray;
    const fieldType = this.editCollectionForm.get('newFieldType')?.value;

    if (!fieldType) {
      this.toastr.error('Please select a field type before adding.');
      return;
    }

    if (this.isFieldTypeLimitExceeded(fieldType, customFields)) {
      return;
    }

    customFields.push(this.fb.group({
      label: ['', Validators.required],
      fieldType: [fieldType, Validators.required],
      value: [''],
    }));
  }

  private isFieldTypeLimitExceeded(fieldType: string, customFields: FormArray): boolean {
    const fieldTypeCount = customFields.controls.filter(
      control => control.get('fieldType')?.value === fieldType
    ).length;
    const limit = 3;
    if (fieldTypeCount >= limit) {
      this.toastr.error(`You can only add up to ${limit} ${fieldType} fields.`);
      return true;
    }
    return false;
  }

  removeCustomField(index: number): void {
    const customFields = this.editCollectionForm.get('customFields') as FormArray;
    customFields.removeAt(index);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy';
    }
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer) {
      this.collectionImageFile = event.dataTransfer.files[0];
      this.updateImagePreview();
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.collectionImageFile = input.files[0];
      this.updateImagePreview();
    }
  }

  private updateImagePreview(): void {
    if (this.collectionImageFile) {
      const url = this.sanitizer.bypassSecurityTrustUrl(
        window.URL.createObjectURL(this.collectionImageFile)
      );
      this.collectionUrlImageUrl = url;
    }
  }

  cancel(): void {
    this.location.back();
  }

  onSubmit(): void {
    if (this.editCollectionForm.invalid) {
      this.toastr.error('Please fill in all required fields.');
      return;
    }

    this.isClicked = true;

    if (this.collectionImageFile) {
      this.cloudinaryService.uploadImage(this.collectionImageFile).then(
        (url: string) => {
          this.collectionUrlImageUrl = url
          this.updateCollection();
        
        }
      ).catch(error => {
        console.error('Image upload failed:', error);
      });
    }
    
    else{
      this.updateCollection();
    }
    
  }

  private updateCollection(): void {
    this.updateCollectionModel = {
      id: this.collection.id,
      name: this.editCollectionForm.value.name,
      description: this.editCollectionForm.value.description,
      topic: this.editCollectionForm.value.topic,
      imageUrl: this.collectionUrlImageUrl ? this.collectionUrlImageUrl.toString() : this.collection.imageUrl,
      userId: this.collection.userId,
    }

    console.log('updateCollectionModel', this.updateCollectionModel)
    this.collectionService.updateCollection(this.updateCollectionModel).subscribe(
      () => {
        this.toastr.success('Collection updated successfully.');
        this.updateCustomFields();
      },
      (error) => {
        this.toastr.error('Failed to update the collection.');
        this.isClicked = false;
      }
    );
  }

  updateCustomFields(): void {
    const customFieldData: updateCustomFieldRequest[] =
      this.editCollectionForm.value.customFields.map((field: any) => ({
        id: field.id,
        name: field.label,
        fieldType: field.fieldType,
        collectionId: this.collection.id,
        customFieldValues: []
      }));


      this.updateCustomFieldModel = customFieldData;
      this.customFieldService.updateCustomField(this.updateCustomFieldModel).subscribe(
        () => {
          this.isClicked = false;
          this.router.navigate(['/collection-detail', this.collection.id]);
        },
        (error) => {
          this.toastr.error('Failed to update the custom fields.');
          this.isClicked = false;
        }
      );
  }

  getCategories(): void {
    this.collectionService.getCategories().subscribe(
      (response: Categories[]) => {
        this.categories = response;
        console.log('categories',this.categories);
      }
    )
  }
}

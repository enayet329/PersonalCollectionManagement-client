import { Component, OnInit } from '@angular/core';
import {
  Collection,
  AddCollectionRequest,
} from '../../../core/model/collection.mode.';
import { CustomField } from '../../../core/model/customField.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserModel } from '../../../core/model/user.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CollectionService } from '../../../core/services/collection.service';
import { CustomFieldService } from '../../../core/services/custom-field.service';
import { CloudinaryUploadService } from '../../../core/services/image-upload.service';
import { ToastrService } from 'ngx-toastr';
import { JwtDecoderService } from '../../../core/services/jwt-decoder.service';
import { AdminService } from '../../../core/services/admin.service';
import { Categories } from '../../../core/model/categories.model';

@Component({
  selector: 'app-add-collection',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-collection.component.html',
  styleUrls: ['./add-collection.component.css'],
})
export class AddCollectionComponent implements OnInit {
  addCollectionForm!: FormGroup;
  private collectionImageFile: File | null = null;
  public collectionUrlImageUrl: SafeUrl | null = null;
  categories: Categories[] = [];
  userId: string = '';
  collection: Collection = {} as Collection;
  users: UserModel[] = [];
  isClicked: boolean = false;

  //user state
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  isUser: boolean = false;

  constructor(
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private router: Router,
    private route: ActivatedRoute,
    private collectionService: CollectionService,
    private customFieldService: CustomFieldService,
    private adminService: AdminService,
    private cloudinaryService: CloudinaryUploadService,
    private toastr: ToastrService,
    private jwtDecoder: JwtDecoderService
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id') || '';
    this.getCollectionCategories();
    this.initializeForm();
    this.initializeUserState();

    if (this.isAdmin) {
      this.getUsers();
    }
  }

  initializeForm() {
    this.addCollectionForm = this.fb.group({
      title: ['', Validators.required],
      user: [this.userId, Validators.required],
      category: ['', Validators.required],
      image: [null],
      description: [''],
      customFields: this.fb.array([]),
      newFieldType: ['string'],
    });
  }

  private initializeUserState() {
    const token = localStorage.getItem('token');

    if (token && token !== 'null') {
      this.isAdmin = this.jwtDecoder.getIsAdminFromToken(token);
      this.isLoggedIn = true;
      this.isUser = this.jwtDecoder.getUserIdFromToken(token) === this.userId;
    } else {
      this.isLoggedIn = false;
      this.isAdmin = false;
      this.isUser = false;
    }
  }

  getUsers(): void {
    this.adminService.getUsers().subscribe(
      (response) => {
        this.users = response;
      },
      (error) => {
        console.error('Error getting users:', error);
      }
    );
  }

  get customFieldsControls() {
    return (this.addCollectionForm.get('customFields') as FormArray).controls;
  }

  addCustomField() {
    const customFields = this.addCollectionForm.get(
      'customFields'
    ) as FormArray;
    const fieldTypeControl = this.addCollectionForm.get('newFieldType');

    const fieldType = fieldTypeControl?.value || 'string';

    if (!fieldType) {
      this.toastr.error('Please select a field type before adding.');
      return;
    }

    const integerFieldsCount = customFields.controls.filter(
      (control) => control.get('fieldType')?.value === 'integer'
    ).length;
    const stringFieldsCount = customFields.controls.filter(
      (control) => control.get('fieldType')?.value === 'string'
    ).length;
    const multilineTextFieldsCount = customFields.controls.filter(
      (control) => control.get('fieldType')?.value === 'multiline-text'
    ).length;
    const booleanFieldsCount = customFields.controls.filter(
      (control) => control.get('fieldType')?.value === 'boolean'
    ).length;
    const dateFieldsCount = customFields.controls.filter(
      (control) => control.get('fieldType')?.value === 'date'
    ).length;

    if (fieldType === 'integer' && integerFieldsCount >= 3) {
      this.toastr.error('You can only add up to 3 integer fields.');
      return;
    }
    if (fieldType === 'string' && stringFieldsCount >= 3) {
      this.toastr.error('You can only add up to 3 string fields.');
      return;
    }
    if (fieldType === 'multiline-text' && multilineTextFieldsCount >= 3) {
      this.toastr.error('You can only add up to 3 multiline-text fields.');
      return;
    }
    if (fieldType === 'boolean' && booleanFieldsCount >= 3) {
      this.toastr.error('You can only add up to 3 boolean fields.');
      return;
    }
    if (fieldType === 'date' && dateFieldsCount >= 3) {
      this.toastr.error('You can only add up to 3 date fields.');
      return;
    }

    customFields.push(
      this.fb.group({
        label: ['', Validators.required],
        fieldType: [fieldType, Validators.required],
      })
    );
  }

  removeCustomField(index: number) {
    const customFields = this.addCollectionForm.get(
      'customFields'
    ) as FormArray;
    customFields.removeAt(index);
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
      this.collectionImageFile = file;
      this.updateItemImageUrl();
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.collectionImageFile = file;
      this.updateItemImageUrl();
    }
  }

  private updateItemImageUrl() {
    if (this.collectionImageFile) {
      this.collectionUrlImageUrl = this.sanitizer.bypassSecurityTrustUrl(
        URL.createObjectURL(this.collectionImageFile)
      );
    } else {
      this.collectionUrlImageUrl = null;
    }
  }

  getCollectionCategories(): void {
    this.collectionService.getCategories().subscribe(
      (response: Categories[]) => {
        this.categories = response;
      },
      (error) => {
        console.error('Error getting categories:', error);
      }
    );
  }

  onSubmit() {
    this.isClicked = true;
    if (this.addCollectionForm.valid) {
      if (this.collectionImageFile) {
        this.cloudinaryService
          .uploadImage(this.collectionImageFile)
          .then((url: string) => {
            this.createCollection(url);
          })
          .catch((error: Error) => {
            this.toastr.error('Error uploading image', 'Please try again.');
            this.isClicked = false;
          });
      } else {
        this.createCollection('');
      }
    } else {
      this.toastr.error('Form is invalid', 'Please fill all required fields.');
      this.isClicked = false;
    }
  }

  createCustomFields(customFields: CustomField[]): void {
    this.customFieldService.addCustomField(customFields).subscribe(
      (response) => {
        console.log('Custom fields added successfully');
        this.toastr.success('Custom fields added successfully');
      },
      (error) => {
        console.error('Error creating custom fields:', error);
        this.toastr.error('Error adding custom fields', 'Please try again.');
        if (error.error && error.error.errors) {
          console.error('Validation errors:', error.error.errors);
        }
      }
    );
  }

  createCollection(imageUrl: string): void {
    const formValue = this.addCollectionForm.value;
    const collection: AddCollectionRequest = {
      name: formValue.title,
      description: formValue.description,
      topic: formValue.category,
      imageUrl: imageUrl,
      userId: formValue.user,
    };

    this.collectionService.addCollection(collection).subscribe(
      (response) => {
        this.collection = response;
        console.log('Collection created successfully');

        const customFields: CustomField[] = formValue.customFields.map(
          (cf: any) => ({
            name: cf.label,
            fieldType: cf.fieldType,
            collectionId: response.id,
          })
        );

        if (customFields.length > 0) {
          this.createCustomFields(customFields);
        }

        this.toastr.success('Collection created successfully');
        this.router.navigate(['/collection-detail', response.id]);
      },
      (error) => {
        console.error('Error creating collection:', error);
        this.toastr.error('Error creating collection', 'Please try again.');
        this.isClicked = false;
      }
    );
  }

  cancel(): void {
    this.router.navigate(['/profile-view', this.userId]);
  }
}

import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { CollectionService } from '../../../core/services/collection.service';
import { UserModel } from '../../../core/model/user.model';
import { JwtDecoderService } from '../../../core/services/jwt-decoder.service';
import { Collection } from '../../../core/model/collection.mode.';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CloudinaryUploadService } from '../../../core/services/image-upload.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-profile-view',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.css'],
})
export class ProfileViewComponent implements OnInit {
  user: UserModel = {} as UserModel;
  collections: Collection[] = [];
  updateProfileImage: File | null = null;
  imageURL: SafeUrl | null = null;
  dropdownToggle: boolean = false;
  routeId: string | null = null;

  profileUpdateForm: FormGroup = new FormGroup({});

  // user state
  token: string | null = null;
  userId: string | null = null;
  isAdmin: boolean = false;
  userIsLoggedIn: boolean = false;
  isBlocked: boolean = false;
  isUser: boolean = false;
  isDark: boolean = false;

  constructor(
    private userService: UserService,
    private collectionService: CollectionService,
    private jwtDecoder: JwtDecoderService,
    private router: Router,
    private formBuilder: FormBuilder,
    private cloudinaryService: CloudinaryUploadService,
    public modalService: NgbModal,
    private sanitizer: DomSanitizer,
    private toaster: ToastrService,
    private route: ActivatedRoute,
  ) {}

  darkModeService: ThemeService = inject(ThemeService);

  ngOnInit() {
    this.routeId = this.route.snapshot.paramMap.get('id');
    this.initializeUserState();
    this.getUserProfile();
    this.getCollectionsByUserId();
  }

  private initializeUserState() {
    this.token = localStorage.getItem('token');
    if (this.token && this.token !== 'null') {
      this.userId = this.jwtDecoder.getUserIdFromToken(this.token);
      this.isAdmin = this.jwtDecoder.getIsAdminFromToken(this.token);
      this.isBlocked = this.jwtDecoder.getIsBlockedFromToken(this.token);
      this.userIsLoggedIn = true;
      this.isUser = this.userId === this.routeId;
      if(this.isUser || this.isAdmin || this.userIsLoggedIn)
      {
        this.initForm();        
        this.userId = this.routeId;
      }
    } else {
      this.resetUserState();
    }
  }

  private resetUserState() {
    this.userIsLoggedIn = false;
    this.isAdmin = false;
    this.userId = null;
    this.token = null;
    this.isBlocked = false;
  }

  isDarkMode(): boolean {
    return this.darkModeService.darkModeSignal.toString() === 'dark';
  }
  

  private initForm() {
    this.profileUpdateForm = this.formBuilder.group({
      name: [this.user.username, Validators.required],
      email: [this.user.email],
      preferredLanguage: [this.user.preffrredThemeDark],
      preferredThemeDark: [this.user.preffrredThemeDark],
      profilePic: [this.user.imageURL],
      joinedAt: [this.user.joinedAt],
    });
  }

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.updateProfileImage = event.target.files[0];
      this.updateImageURL();
    }
  }

  onDragOver(event: any) {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy';
    }
  }

  onDrop(event: any) {
    event.preventDefault();
    this.updateProfileImage = event.dataTransfer?.files[0] || null;
    this.updateImageURL();
  }

  private updateImageURL() {
    if (this.updateProfileImage) {
      this.imageURL = this.sanitizer.bypassSecurityTrustUrl(
        URL.createObjectURL(this.updateProfileImage)
      );
    }
  }

  onSubmit(): void {
    if (this.profileUpdateForm.valid) {
      if (this.updateProfileImage) {
        this.cloudinaryService
          .uploadImage(this.updateProfileImage)
          .then((Url: string) => {
            this.updateUser(Url);
          })
          .catch((error) => {
            console.error('Failed to upload image:', error);
            this.toaster.error('Failed to upload image', 'Error');
          });
      } else {
        this.updateUser(this.user.imageURL || '');
      }
    } else {
      this.toaster.error('Please complete the form correctly', 'Error');
    }
  }

  private updateUser(imageURL: string): void {
    const formValue = this.profileUpdateForm.value;
    const user: UserModel = {
      id: this.userId!,
      username: formValue.name,
      email: this.user.email,
      imageURL: imageURL,
      prefrredLanguage: formValue.preferredLanguage === 'English' ? 'en' : 'bn',
      preffrredThemeDark: formValue.preferredThemeDark,
      joinedAt: formValue.joinedAt,
      isAdmin: this.isAdmin,
      isBlocked: this.isBlocked,
    };

    this.userService.updateUser(user).subscribe(
      (response) => {
        console.log('Profile updated successfully');
        this.toaster.success('Profile updated successfully', 'Success');
        localStorage.setItem('theme', formValue.preferredThemeDark == true?'dark':'null');
        this.getUserProfile();
        this.modalService.dismissAll();
        window.location.reload();
      },
      (error) => {
        console.error('Failed to update profile:', error);
        this.toaster.error(
          'Failed to update profile: ' +
            (error.error?.message || error.message),
          'Error'
        );
      }
    );
  }

  private getUserProfile() {
    if (this.userId) {
      this.userService.getUserById(this.userId).subscribe((response) => {
        this.user = response;
        this.initForm();
      });
    }
  }

  deleteCollection(collectionId: string): void {
    if (confirm('Are you sure you want to delete this collection?')) {
      this.collectionService
        .deleteCollection(collectionId)
        .subscribe((response: any) => {
          this.toaster.success('Collection deleted successfully', 'Success');
          this.getCollectionsByUserId();
        });
    }
  }

  private getCollectionsByUserId() {
    if (this.userId) {
      this.collectionService
        .getCollectionByUserId(this.userId)
        .subscribe((response) => {
          this.collections = response;
        });
    }
  }

  openModal(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'updateUserModalLabel' });
  }

  addCollection(userId: string): void {
    this.router.navigate(['/add-collection', userId]);
  }

  goToCollectionDetails(collectionId: string): void {
    this.router.navigate(['/collection-detail', collectionId]);
  }

  editCollection(collectionId: string): void {
    this.router.navigate(['/edit-collection', collectionId]);
  }
}

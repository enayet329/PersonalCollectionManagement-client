import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLinkActive, Router } from '@angular/router';
import { NgbCollapseModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ThemeService } from '../../core/services/theme.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ResponseModel } from '../../core/model/response.model';
import { CloudinaryUploadService } from '../../core/services/image-upload.service';
import { UserService } from '../../core/services/user.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterLinkActive,
    NgbCollapseModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isMenuCollapsed = true;
  currentLanguage = 'en';
  userIsLoggedIn = false;
  isAdmin = true;
  isProfileDropdownOpen = false;

  darkModeService: ThemeService = inject(ThemeService);
  searchQuery = '';

  @ViewChild('signinModal') signinModal: any;
  @ViewChild('signupModal') signupModal: any;

  signupForm: FormGroup = new FormGroup({});
  signinForm: FormGroup = new FormGroup({});
  profileImage: File | null = null;
  profileImageUrl: SafeUrl | null = null;

  constructor(
    private formBuilder: FormBuilder,
    public modalService: NgbModal,
    private router: Router,
    private cloudinaryService: CloudinaryUploadService,
    private userService: UserService,
    private sanitizer: DomSanitizer
  ) {}
  

  toggleMenu() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }

  toggleDarkMode() {
    this.darkModeService.updateDarkMode();
  }

  toggleLanguage() {
    this.currentLanguage = this.currentLanguage === 'en' ? 'bn' : 'en';
  }

  toggleProfileDropdown() {
    this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
  }

  logout() {
    // Implement logout logic here
  }

  search() {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search-results'], { queryParams: { query: this.searchQuery } });
    }
  }

  ngOnInit() {
    this.initForms();
  }

  initForms() {
    this.signupForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      profileImageUrl: ['']
    });

    this.signinForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onFileSelected(event: any) {
    this.profileImage = event.target.files[0];
    this.updateProfileImageUrl();
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy';
    }
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.profileImage = event.dataTransfer?.files[0] || null;
    this.updateProfileImageUrl();
  }

  private updateProfileImageUrl() {
    if (this.profileImage) {
      this.profileImageUrl = this.sanitizer.bypassSecurityTrustUrl(
        URL.createObjectURL(this.profileImage)
      );
    } else {
      this.profileImageUrl = null;
    }
  }

  onSubmit() {
    console.log('Form Submitted');
    if (this.signupForm.valid) {
      console.log('Form is valid');
      if (this.profileImage) {
        console.log('Uploading image');
        this.cloudinaryService.uploadImage(this.profileImage)
          .then((url: string) => {
            console.log('Image uploaded successfully:', url);
            this.signupForm.patchValue({ profileImageUrl: url });
            this.register();
          })
          .catch((error: Error) => {
            console.error('Error uploading image:', error);
          });
      } else {
        this.register();
      }
    } else {
      console.log('Form is invalid');
    }
  }

  onSigninSubmit() {
    if (this.signinForm.valid) {
      const credentials = this.signinForm.value;
      // Implement sign-in logic here
      console.log('Sign in with:', credentials);
    } else {
      console.log('Sign in form is invalid');
    }
  }

  register() {
    console.log('Register method called');
    const requestPayload = {
      username: this.signupForm.value.name,
      email: this.signupForm.value.email,
      passwordHash: this.signupForm.value.password,
      imageURL: this.signupForm.value.profileImageUrl
    };

    console.log('Request Payload:', requestPayload);

    this.userService.registerUser(requestPayload).subscribe(
      (response: ResponseModel) => {

        if (response.success == true) {

          console.log("User registered successfully", response);
          this.modalService.dismissAll();
        } else {
          console.error(response.message);
        }
      },
      (error: { error: { errors: any; }; }) => {
        console.error('Registration error:', error);
        if (error.error && error.error.errors) {
          console.error('Validation Errors:', error.error.errors);
        }
      }
    );
  }
}

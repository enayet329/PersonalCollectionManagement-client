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
import { ToastrService  } from 'ngx-toastr';

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
  private token: string | null = localStorage.getItem('token');
  private prefferedTheme: boolean | null = localStorage.getItem('prefferedThemeDark') 
  ? JSON.parse(localStorage.getItem('prefferedThemeDark')!) 
  : null;

  private prefferedLanguage: string | null = localStorage.getItem('prefferedLanguage');
  isMenuCollapsed = true;
  currentLanguage = this.prefferedLanguage;
  userIsLoggedIn: boolean = this.token? true : false;
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
    private sanitizer: DomSanitizer,
    private toastr: ToastrService
  ) {}
  

  toggleMenu() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }

  toggleDarkMode() {
    this.darkModeService.updateDarkMode();
  }

  toggleLanguage() {
    this.currentLanguage = this.currentLanguage === 'en'? 'bn' : 'en';
    localStorage.setItem('prefferedLanguage', this.currentLanguage);
  }

  toggleProfileDropdown() {
    this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
  }

  logout() {
    if (localStorage.getItem('token')) {
      localStorage.removeItem('token');
      this.userIsLoggedIn = false;
      this.toastr.success('Logout Successful', 'See you again!');
      this.router.navigate(['/home']);
    } else {
      this.toastr.error('Logout Failed', 'No user is logged in.');
    }
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
    if (this.signupForm.valid) {
      if (this.profileImage) {
        this.cloudinaryService.uploadImage(this.profileImage)
          .then((url: string) => {
            this.signupForm.patchValue({ profileImageUrl: url });
            this.register();
          })
          .catch((error: Error) => {
            this.toastr.error('Error uploading image', 'Please try again.');
          });
      } else {
        this.register();
      }
    } else {
      this.toastr.error('Form is invalid', 'Please fill all required fields.');
    }
  }

  onSigninSubmit() {
    if (this.signinForm.valid) {
      this.login();
    } else {
      this.toastr.error('Sign in form is invalid', 'Please fill all required fields.');
    }
  }

  login() {
    const requestPayload = {
      email: this.signinForm.value.email,
      password: this.signinForm.value.password
    };

    this.userService.loginUser(requestPayload).subscribe(
      (response: ResponseModel) => {
        if (response.success) {
          localStorage.setItem('token', JSON.stringify(response));
          localStorage.setItem('prefferedLanguage', response.preferredLanguage ? response.preferredLanguage : 'en');
          localStorage.setItem('theme', JSON.stringify(response.preferredThemeDark ? 'dark' : 'null'));
          this.userIsLoggedIn = true;
          this.toastr.success('Login Successful', 'Welcome back!');
          this.modalService.dismissAll();
        } else {
          this.toastr.error('Login Failed', response.message || 'Please try again.');
        }
      },
      (error) => {
        this.toastr.error('Login Error', error.message || 'An unexpected error occurred.');
      }
    );
  }

  register() {
    const requestPayload = {
      username: this.signupForm.value.name,
      email: this.signupForm.value.email,
      passwordHash: this.signupForm.value.password,
      imageURL: this.signupForm.value.profileImageUrl
    };

    this.userService.registerUser(requestPayload).subscribe(
      (response: ResponseModel) => {
        if (response.success) {
          this.toastr.success('Registration Successful', 'Please login to continue!');
          this.modalService.dismissAll();
        } else {
          this.toastr.error('Registration Failed', response.message || 'Please try again.');
        }
      },
      (error) => {
        this.toastr.error('Registration Error', error.message || 'An unexpected error occurred.');
      }
    );
  }
}

import { Component, ElementRef, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLinkActive, Router } from '@angular/router';
import { NgbCollapseModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ThemeService } from '../../core/services/theme.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ResponseModel } from '../../core/model/response.model';
import { CloudinaryUploadService } from '../../core/services/image-upload.service';
import { UserService } from '../../core/services/user.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { JwtDecoderService } from '../../core/services/jwt-decoder.service';

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
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  user: any = null;
  private token: string | null = null;
  userId: string | null = null;
  isAdmin: boolean = false;
  userIsLoggedIn: boolean = false;
  isBlocked: boolean = false;
  preferredLanguage: string | null = null;
  preferredThemeDark: boolean = false;

  isMenuCollapsed = true;
  currentLanguage: string | null = null;
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
    private toastr: ToastrService,
    private jwtDecoder: JwtDecoderService,
    private elementRef: ElementRef
  ) {}

  @HostListener('document:click', ['$event'])
  clickout(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isProfileDropdownOpen = false;
    }
  }

  ngOnInit() {
    this.initForms();
    this.initializeUserState();
  }

  private initializeUserState() {
    this.token = localStorage.getItem('token');
    if (this.token && this.token !== 'null') {
      this.userId = this.jwtDecoder.getUserIdFromToken(this.token);
      this.isAdmin = this.jwtDecoder.getIsAdminFromToken(this.token);
      this.isBlocked = this.jwtDecoder.getIsBlockedFromToken(this.token);
      this.preferredLanguage = this.jwtDecoder.getPreferredLanguageFromToken(
        this.token
      );
      this.preferredThemeDark = this.jwtDecoder.getPreferredThemeDarkFromToken(
        this.token
      );
      this.user = {
        id: this.userId,
        username: this.jwtDecoder.getUsernameFromToken(this.token),
        email: this.jwtDecoder.getEmailFromToken(this.token),
        isAdmin: this.isAdmin,
        isBlocked: this.isBlocked,
      };
      this.userIsLoggedIn = true;
      this.currentLanguage = this.preferredLanguage || 'en';
    } else {
      this.resetUserState();
    }
  }

  private resetUserState() {
    this.userIsLoggedIn = false;
    this.isAdmin = false;
    this.userId = null;
    this.user = null;
    this.token = null;
    this.isBlocked = false;
    this.preferredLanguage = null;
    this.preferredThemeDark = false;
    this.currentLanguage = 'en';
  }

  toggleMenu() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }

   toggleDarkMode() {
    this.preferredThemeDark = !this.preferredThemeDark;
    this.darkModeService.updateDarkMode();
    this.userService.updateTheme(this.userId!, this.preferredThemeDark).subscribe(
      (response: ResponseModel) => {
        if (response.message !== 'Error') {
          this.toastr.success('Theme updated successfully');
          console.log('Theme updated');
        } else {
          this.preferredThemeDark = !this.preferredThemeDark;
          this.toastr.error(
            'Error updating theme',
            response.message || 'Please try again.'
          );
        }
      },
      (error) => {
        this.preferredThemeDark = !this.preferredThemeDark;
        this.toastr.warning('Please login to update theme', 'Error');
      }
    );
  }
  
  toggleLanguage() {
    this.currentLanguage = this.currentLanguage === 'en' ? 'bn' : 'en';
    this.toastr.info('Language update feauture is not available yet', 'Info');
    localStorage.setItem('prefferedLanguage', this.currentLanguage);
  }

  openProfil(userId: string): void {
    this.router.navigate(['/profile-view', userId]);
    this.isProfileDropdownOpen = false;
  }

  toggleOpenProfileDropdown(event: MouseEvent) {
    event.stopPropagation();
    this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
  }

  logout() {
    if (this.token) {
      this.resetUserState();
      this.toastr.success('Logout Successful', 'See you again!');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('prefferedLanguage');
      this.router.navigate(['/']);

      window.location.reload();
    } else {
      this.toastr.error('Logout Failed', 'No user is logged in.');
    }
  }

  search() {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search-results'], {
        queryParams: { query: this.searchQuery },
      });
    }
  }

  initForms() {
    this.signupForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(1)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      profileImageUrl: ['',Validators.pattern(/\.(jpg|jpeg|png)$/)],
    });

    this.signinForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['',[Validators.required, Validators.minLength(4)]],
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
        this.cloudinaryService
          .uploadImage(this.profileImage)
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
      this.toastr.error(
        'Sign in form is invalid',
        'Please fill all required fields.'
      );
    }
  }

  login() {
    const requestPayload = {
      email: this.signinForm.value.email,
      password: this.signinForm.value.password,
    };

    this.userService.loginUser(requestPayload).subscribe(
      (response: ResponseModel) => {
        if (response.success) {
          const token = response.accessToken!;
          const isBlocked = this.jwtDecoder.getIsBlockedFromToken(token);
          const preferredThemeDark = this.jwtDecoder.getPreferredThemeDarkFromToken(token);

          if (isBlocked) {
            this.toastr.error(
              'Login Failed',
              'Your account is blocked. Please contact support.'
            );
            return;
          }
          localStorage.setItem('token', token);
          localStorage.setItem('refreshToken', response.refreshToken!)
          localStorage.setItem('theme',preferredThemeDark == true ? 'dark' : 'null')
          this.initializeUserState();
          this.toastr.success('Login Successful', 'Welcome back!');
          this.modalService.dismissAll();
          this.router.navigate(['/']);

        } else {
          this.toastr.error(
            'Login Failed',
            response.message || 'Please try again.'
          );
        }
      },
      (error) => {
        this.toastr.error(
          'Login Error',
          error.message || 'An unexpected error occurred.'
        );
      }
    );
  }

  register() {
    const requestPayload = {
      username: this.signupForm.value.name,
      email: this.signupForm.value.email,
      passwordHash: this.signupForm.value.password,
      imageURL: this.signupForm.value.profileImageUrl,
    };

    this.userService.registerUser(requestPayload).subscribe(
      (response: ResponseModel) => {
        if (response.success) {
          this.toastr.success(
            'Registration Successful',
            'Please login to continue!'
          );
          this.modalService.dismissAll();
        } else {
          this.toastr.error(
            'Registration Failed',
            response.message || 'Please try again.'
          );
        }
      },
      (error) => {
        this.toastr.error(
          'Registration Error',
          error.message || 'An unexpected error occurred.'
        );
      }
    );
  }
}

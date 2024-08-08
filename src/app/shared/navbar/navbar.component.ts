import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLinkActive, Router } from '@angular/router';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { ThemeService } from '../../core/services/theme.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterLinkActive,
    NgbCollapseModule,
    FormsModule
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

  constructor(private router: Router) {}

  toggleMenu() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }

  toggleDarkMode() {
    this.darkModeService.updateDarkMode();
  }

  toggleLanguage() {
    this.currentLanguage = this.currentLanguage === 'en' ? 'bn' : 'en';
    // Implement language change logic here
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
}
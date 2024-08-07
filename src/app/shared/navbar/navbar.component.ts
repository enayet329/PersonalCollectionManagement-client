import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import {ReactiveFormsModule } from '@angular/forms';
import {RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterOutlet, NgbCollapseModule,RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'], // Correct property name
})
export class NavbarComponent {
  isMenuCollapsed = true;
  isDarkMode = false;
  currentLanguage = 'en';
  userIsLoggedIn = true; // Set this based on your authentication logic
  isAdmin = false; // Set this based on user role
  isProfileDropdownOpen = false;

  toggleMenu() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    // Implement dark mode logic here
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

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (!(event.target as HTMLElement).closest('.dropdown')) {
      this.isProfileDropdownOpen = false;
    }
  }
}
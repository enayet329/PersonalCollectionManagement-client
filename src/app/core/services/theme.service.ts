import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  darkModeSignal = signal<string>('null');

  constructor() {
    const savedTheme = localStorage.getItem('theme') || 'null';
    this.darkModeSignal.set(savedTheme);
    this.applyTheme(savedTheme);
  }

  updateDarkMode() {
    this.darkModeSignal.update((value) => {
      const newTheme = value === 'dark' ? 'null' : 'dark';
      this.applyTheme(newTheme);
      return newTheme;
    });
  }

  private applyTheme(theme: string) {
    document.body.classList.toggle('enabled', theme === 'dark');
    localStorage.setItem('theme', theme);
  }
}

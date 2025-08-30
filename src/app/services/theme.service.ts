import { Injectable, signal, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private platformId = inject(PLATFORM_ID);
  private darkTheme = signal(false);
  private isDarkThemeSubject = new BehaviorSubject<boolean>(false);
  
  isDarkTheme$ = this.isDarkThemeSubject.asObservable();

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      // Check for saved theme preference or default to light mode
      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      const isDark = savedTheme ? savedTheme === 'dark' : prefersDark;
      this.setTheme(isDark);

      // Listen for system theme changes
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
          this.setTheme(e.matches);
        }
      });
    }
  }

  toggleTheme() {
    if (isPlatformBrowser(this.platformId)) {
      const newTheme = !this.darkTheme();
      this.setTheme(newTheme);
      localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    }
  }

  private setTheme(isDark: boolean) {
    this.darkTheme.set(isDark);
    this.isDarkThemeSubject.next(isDark);
    
    if (isPlatformBrowser(this.platformId)) {
      if (isDark) {
        document.documentElement.classList.add('dark-theme');
        document.documentElement.classList.remove('light-theme');
      } else {
        document.documentElement.classList.add('light-theme');
        document.documentElement.classList.remove('dark-theme');
      }
    }
  }

  getCurrentTheme() {
    return this.darkTheme();
  }
}

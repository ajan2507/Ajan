import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  isMenuOpen = false;
  isScrolled = false;
  activeSection = '';

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.pageYOffset > 50;
    this.updateActiveSection();
  }

  toggleMobileMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    
    // Prevent body scroll when mobile menu is open
    if (this.isMenuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
  }

  scrollToTop(event: Event) {
    event.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    this.closeMobileMenu();
  }

  scrollToSection(event: Event, sectionId: string) {
    event.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = 70; // Account for fixed header
      const elementPosition = element.offsetTop - headerHeight;
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
    this.closeMobileMenu();
  }

  private closeMobileMenu() {
    this.isMenuOpen = false;
    document.body.classList.remove('menu-open');
  }

  private updateActiveSection() {
    const sections = ['about', 'education', 'work', 'certifications', 'skills', 'projects', 'contact'];
    const scrollPosition = window.pageYOffset + 100;

    for (const section of sections) {
      const element = document.getElementById(section);
      if (element) {
        const sectionTop = element.offsetTop;
        const sectionBottom = sectionTop + element.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          this.activeSection = section;
          break;
        }
      }
    }
  }
}


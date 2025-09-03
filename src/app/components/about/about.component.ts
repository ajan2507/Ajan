import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent implements OnInit, AfterViewInit {
  @ViewChild('aboutSection', { static: true }) aboutSection!: ElementRef;
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  
  ngOnInit() {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.setupScrollAnimations();
    }
  }

  private setupScrollAnimations() {
    if (typeof IntersectionObserver === 'undefined') {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Add animations with staggered delays
          setTimeout(() => {
            this.animateElement('.introduction-section', 'animate-fade-up');
          }, 100);
          
          setTimeout(() => {
            this.animateElement('.overview-title-section', 'animate-slide-bottom');
          }, 300);
          
          setTimeout(() => {
            this.animateElement('.profile-section', 'animate-slide-left');
          }, 500);
          
          setTimeout(() => {
            this.animateElement('.content-section', 'animate-slide-right');
          }, 700);
          
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: '200px 0px -50px 0px'
    });

    if (this.aboutSection?.nativeElement) {
      observer.observe(this.aboutSection.nativeElement);
    }
  }

  private animateElement(selector: string, animationClass: string) {
    const element = this.aboutSection.nativeElement.querySelector(selector);
    if (element) {
      element.classList.add(animationClass);
    }
  }
}

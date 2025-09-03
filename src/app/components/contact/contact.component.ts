import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PlanetCanvasComponent } from '../planet-canvas/planet-canvas.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    PlanetCanvasComponent
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent implements OnInit, AfterViewInit {
  @ViewChild('contactSection') contactSection!: ElementRef;
  contactForm!: FormGroup;
  isFormSubmitted = false;
  isLoading = false;
  showSuccessPopup = false;

  constructor(
    private fb: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.setupScrollAnimations();
    }
  }

  private setupScrollAnimations() {
    if (typeof IntersectionObserver === 'undefined') {
      return;
    }

    let hasAnimated = false;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;
          
          // Stagger animations like About component
          setTimeout(() => {
            this.animateElement('.introduction-section', 'animate-fadeInUp');
          }, 100);
          
          setTimeout(() => {
            this.animateElement('.title-section', 'animate-slideInFromBottom');
          }, 300);
          
          setTimeout(() => {
            this.animateElement('.form-section', 'animate-slide-left');
          }, 500);
          
          setTimeout(() => {
            this.animateElement('.globe-section', 'animate-slide-right');
          }, 700);
          
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.05, // Much lower threshold for earlier trigger
      rootMargin: '200px 0px -50px 0px' // Trigger 200px before element enters view
    });

    if (this.contactSection?.nativeElement) {
      observer.observe(this.contactSection.nativeElement);
    }
  }

  private animateElement(selector: string, animationClass: string) {
    const element = this.contactSection.nativeElement.querySelector(selector);
    if (element) {
      element.classList.add(animationClass);
    }
  }

  onSubmit(): void {
    this.isFormSubmitted = true;
    if (this.contactForm.valid) {
      this.isLoading = true;
      
      // Simulate form submission
      setTimeout(() => {
        this.isLoading = false;
        console.log('Form submitted:', this.contactForm.value);
        
        // Show beautiful success popup
        this.showSuccessPopup = true;
        
        // Auto-hide popup after 4 seconds
        setTimeout(() => {
          this.showSuccessPopup = false;
        }, 4000);
        
        this.contactForm.reset();
        this.isFormSubmitted = false;
      }, 2000);
    }
  }
}

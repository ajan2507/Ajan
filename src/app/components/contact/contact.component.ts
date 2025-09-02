import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PlanetCanvasComponent } from '../planet-canvas/planet-canvas.component';

interface SubmitStatus {
  type: 'success' | 'error';
  message: string;
}

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
  isSubmitting = false;
  submitStatus: SubmitStatus | null = null;

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

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Stagger animations
          setTimeout(() => {
            entry.target.querySelector('.section-subtitle')?.classList.add('animate-fadeInUp');
          }, 0);
          
          setTimeout(() => {
            entry.target.querySelector('.section-title')?.classList.add('animate-slideInFromBottom');
          }, 200);
          
          setTimeout(() => {
            entry.target.querySelector('.phone-section')?.classList.add('animate-fadeInUp');
          }, 400);
          
          setTimeout(() => {
            entry.target.querySelector('.globe-section')?.classList.add('animate-slideInFromLeft');
          }, 600);
          
          setTimeout(() => {
            entry.target.querySelector('.form-section')?.classList.add('animate-slideInFromRight');
          }, 800);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    // Observe the contact section
    const contactElement = document.querySelector('#contact');
    if (contactElement) {
      observer.observe(contactElement);
    }
  }

  async onSubmit() {
    if (this.contactForm.valid) {
      this.isSubmitting = true;
      this.submitStatus = null;

      try {
        // Simulate API call
        await this.simulateFormSubmission();
        
        this.submitStatus = {
          type: 'success',
          message: 'Thank you! Your message has been sent successfully. I\'ll get back to you soon.'
        };
        
        this.contactForm.reset();
      } catch (error) {
        this.submitStatus = {
          type: 'error',
          message: 'Sorry, there was an error sending your message. Please try again later.'
        };
      } finally {
        this.isSubmitting = false;
      }
    }
  }
  get name() { return this.contactForm.get('name'); }
  get email() { return this.contactForm.get('email'); }
  get message() { return this.contactForm.get('message'); }

  private simulateFormSubmission(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 2000);
    });
  }
}

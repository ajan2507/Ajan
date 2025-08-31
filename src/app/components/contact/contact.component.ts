import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EarthCanvasComponent } from '../earth-canvas/earth-canvas.component';

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
    EarthCanvasComponent
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent implements OnInit {
  contactForm!: FormGroup;
  isSubmitting = false;
  submitStatus: SubmitStatus | null = null;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
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

  private simulateFormSubmission(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 2000);
    });
  }
}

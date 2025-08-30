import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
    MatButtonModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatIconModule,
    MatProgressSpinnerModule
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
      subject: ['', [Validators.required]],
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

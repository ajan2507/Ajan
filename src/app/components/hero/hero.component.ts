import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ComputerCanvasComponent } from '../computer-canvas/computer-canvas.component';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, ComputerCanvasComponent],
  template: `
    <section class="hero-section">
      <div class="hero-container">
        <div class="hero-content">
          <div class="text-content">
            <h1 class="main-title">
              Hi, I'm <span class="name-highlight">Karthick</span> 
              <span class="wave-emoji">👋</span>
            </h1>
            
            <p class="subtitle">
              I'm a <span class="typing-text">{{ currentRole }}</span>
            </p>
          </div>
          
          <div class="model-content">
            <div class="hero-right">
              <div class="computer-container">
                <app-computer-canvas></app-computer-canvas>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styleUrl: './hero.component.scss'
})
export class HeroComponent implements OnInit, OnDestroy {
  currentRole = 'Software Engineer';
  private roles = [
    'Software Engineer',
    'Full Stack Developer', 
    'Cloud Solutions Architect',
    'Problem Solver'
  ];
  private currentIndex = 0;
  private typingInterval?: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    // Only start animation in browser environment
    if (isPlatformBrowser(this.platformId)) {
      this.startTypingAnimation();
    }
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId) && this.typingInterval) {
      clearInterval(this.typingInterval);
    }
  }

  private startTypingAnimation() {
    this.typingInterval = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.roles.length;
      this.currentRole = this.roles[this.currentIndex];
    }, 3000);
  }
}

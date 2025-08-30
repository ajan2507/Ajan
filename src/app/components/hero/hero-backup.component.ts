import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="hero-section">
      <div class="hero-container">
        <div class="hero-content">
          <h1>Hi, I'm Sunny 👋</h1>
          <p>I'm a {{ currentRole }}</p>
          <p>Welcome to my portfolio!</p>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero-section {
      min-height: 100vh;
      background: linear-gradient(135deg, #0f1419 0%, #1a1f2e 50%, #0f1419 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }
    .hero-container {
      text-align: center;
    }
    h1 {
      font-size: 3rem;
      margin-bottom: 1rem;
    }
  `]
})
export class HeroComponent implements OnInit, OnDestroy {
  currentRole = 'Systems Administrator';

  ngOnInit() {
    console.log('Hero component initialized successfully!');
  }

  ngOnDestroy() {
    console.log('Hero component destroyed');
  }
}

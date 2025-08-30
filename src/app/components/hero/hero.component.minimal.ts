import { Component } from '@angular/core';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [],
  template: `
    <section style="background: #667eea; color: white; padding: 100px 20px; text-align: center; min-height: 80vh;">
      <h1 style="font-size: 3rem; margin-bottom: 20px;">
        Hi, I'm Karthick Ajan 👋
      </h1>
      <p style="font-size: 1.5rem;">
        Full Stack Developer
      </p>
    </section>
  `,
  styles: []
})
export class HeroComponent {
}

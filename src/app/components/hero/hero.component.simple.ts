import { Component } from '@angular/core';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [],
  template: `
    <section id="hero" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                              color: white; padding: 100px 20px; text-align: center; min-height: 80vh; 
                              display: flex; align-items: center; justify-content: center;">
      <div>
        <h1 style="font-size: 3rem; margin-bottom: 20px; font-family: 'Poppins', sans-serif;">
          Hi, I'm Karthick Ajan 👋
        </h1>
        <p style="font-size: 1.5rem; margin-bottom: 30px;">
          Full Stack Developer & Systems Administrator
        </p>
        <p style="font-size: 1.1rem; opacity: 0.9;">
          Welcome to my portfolio! Building scalable solutions and cloud infrastructure.
        </p>
      </div>
    </section>
  `,
  styles: []
})
export class HeroComponent {
  
}

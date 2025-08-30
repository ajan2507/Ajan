import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent implements OnInit, OnDestroy {
  currentRole = '';
  
  private roles = [
    'Systems Administrator',
    'Full Stack Developer', 
    'Cloud Engineer',
    'DevOps Specialist',
    'Problem Solver',
    'Tech Enthusiast'
  ];
  
  private roleIndex = 0;
  private typewriterTimeout: any;
  private isTyping = false;

  ngOnInit() {
    console.log('Hero component initialized - STABLE VERSION');
    // Start with a delay to ensure component is fully loaded
    setTimeout(() => {
      this.startTypewriterEffect();
    }, 500);
  }

  ngOnDestroy() {
    console.log('Hero component destroyed');
    if (this.typewriterTimeout) {
      clearTimeout(this.typewriterTimeout);
      this.typewriterTimeout = null;
    }
    this.isTyping = false;
  }

  private startTypewriterEffect() {
    if (this.isTyping) return; // Prevent multiple instances
    this.isTyping = true;
    this.typeRole();
  }

  private typeRole() {
    if (!this.isTyping) return; // Safety check
    
    const role = this.roles[this.roleIndex];
    let charIndex = 0;
    
    // Clear current role
    this.currentRole = '';
    
    // Typing animation
    const typeChar = () => {
      if (!this.isTyping) return; // Safety check
      
      if (charIndex < role.length) {
        this.currentRole = role.substring(0, charIndex + 1);
        charIndex++;
        this.typewriterTimeout = setTimeout(typeChar, 150);
      } else {
        // Wait, then erase
        this.typewriterTimeout = setTimeout(() => {
          if (this.isTyping) this.eraseRole();
        }, 2500);
      }
    };
    
    typeChar();
  }

  private eraseRole() {
    if (!this.isTyping) return; // Safety check
    
    let charIndex = this.currentRole.length;
    
    const eraseChar = () => {
      if (!this.isTyping) return; // Safety check
      
      if (charIndex > 0) {
        this.currentRole = this.currentRole.substring(0, charIndex - 1);
        charIndex--;
        this.typewriterTimeout = setTimeout(eraseChar, 75);
      } else {
        // Move to next role
        this.roleIndex = (this.roleIndex + 1) % this.roles.length;
        this.typewriterTimeout = setTimeout(() => {
          if (this.isTyping) this.typeRole();
        }, 1000);
      }
    };
    
    eraseChar();
  }
}

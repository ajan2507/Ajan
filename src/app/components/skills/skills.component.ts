import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { trigger, transition, style, animate } from '@angular/animations';
import { PortfolioDataService, Skill } from '../../services/portfolio-data.service';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss',
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.6s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class SkillsComponent implements OnInit {
  skills: Skill[] = [];
  filteredSkills: Skill[] = [];
  activeCategory: string = 'all';
  isVisible = false;

  private skillIcons: { [key: string]: string } = {
    'Angular': 'code',
    'React': 'code',
    'Vue.js': 'code',
    'TypeScript': 'code',
    'JavaScript': 'code',
    'HTML/CSS': 'web',
    'Sass/SCSS': 'palette',
    'Node.js': 'dns',
    'Python': 'smart_toy',
    'Java': 'coffee',
    'Express.js': 'dns',
    'MongoDB': 'storage',
    'PostgreSQL': 'storage',
    'Docker': 'view_in_ar',
    'AWS': 'cloud',
    'Git': 'code',
    'Webpack': 'build',
    'Jest': 'bug_report'
  };

  constructor(private portfolioService: PortfolioDataService) {}

  ngOnInit() {
    this.portfolioService.getSkills().subscribe(skills => {
      this.skills = skills;
      this.filterSkills();
      // Trigger animations after a short delay
      setTimeout(() => {
        this.isVisible = true;
      }, 200);
    });
  }

  setActiveCategory(category: string) {
    this.activeCategory = category;
    this.filterSkills();
  }

  private filterSkills() {
    if (this.activeCategory === 'all') {
      this.filteredSkills = [...this.skills];
    } else {
      this.filteredSkills = this.skills.filter(skill => skill.category === this.activeCategory);
    }
  }

  getSkillIcon(skillName: string): string {
    const icons = {
      'frontend': 'web',
      'backend': 'storage',
      'tools': 'build',
      'other': 'code'
    };
    return icons[skillName as keyof typeof icons] || this.skillIcons[skillName] || 'code';
  }

  getSkillDescription(skillName: string): string {
    const descriptions: { [key: string]: string } = {
      'Angular': 'Building scalable web applications with TypeScript',
      'React': 'Creating interactive user interfaces and SPAs',
      'Vue.js': 'Developing progressive web applications',
      'TypeScript': 'Type-safe JavaScript development',
      'JavaScript': 'Core programming language for web development',
      'HTML/CSS': 'Semantic markup and responsive styling',
      'Sass/SCSS': 'Advanced CSS preprocessing and styling',
      'Node.js': 'Server-side JavaScript development',
      'Python': 'Backend development and automation',
      'Java': 'Enterprise application development',
      'Express.js': 'Web application framework for Node.js',
      'MongoDB': 'NoSQL database design and implementation',
      'PostgreSQL': 'Relational database management',
      'Docker': 'Containerization and deployment',
      'AWS': 'Cloud infrastructure and services',
      'Git': 'Version control and collaboration',
      'Webpack': 'Module bundling and build optimization',
      'Jest': 'Unit testing and test-driven development'
    };
    return descriptions[skillName] || 'Professional experience with this technology';
  }

  getTotalSkills(): number {
    return this.skills.length;
  }

  getAverageLevel(): number {
    if (this.skills.length === 0) return 0;
    const total = this.skills.reduce((sum, skill) => sum + skill.level, 0);
    return Math.round(total / this.skills.length);
  }

  getYearsExperience(): number {
    return 5; // You can make this dynamic based on your actual experience
  }

  trackBySkill(index: number, skill: Skill): string {
    return skill.name;
  }
}

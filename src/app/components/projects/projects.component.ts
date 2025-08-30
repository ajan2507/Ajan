import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { trigger, transition, style, animate } from '@angular/animations';
import { PortfolioDataService, Project } from '../../services/portfolio-data.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('0.8s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('modalSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.8)' }),
        animate('0.3s ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('0.3s ease-in', style({ opacity: 0, transform: 'scale(0.8)' }))
      ])
    ])
  ]
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = [];
  filteredProjects: Project[] = [];
  activeFilter: string = 'all';
  selectedProject: Project | null = null;
  hasMoreProjects: boolean = false;

  constructor(private portfolioService: PortfolioDataService) {}

  ngOnInit() {
    this.portfolioService.getProjects().subscribe(projects => {
      this.projects = projects;
      this.filterProjects();
      this.hasMoreProjects = projects.length > 6;
    });
  }

  setActiveFilter(filter: string) {
    this.activeFilter = filter;
    this.filterProjects();
  }

  private filterProjects() {
    if (this.activeFilter === 'all') {
      this.filteredProjects = this.projects.slice(0, 6); // Show first 6 projects
    } else {
      this.filteredProjects = this.projects
        .filter(project => project.category === this.activeFilter)
        .slice(0, 6);
    }
  }

  openDemo(url: string) {
    window.open(url, '_blank');
  }

  openGithub(url: string) {
    window.open(url, '_blank');
  }

  openProjectDetails(project: Project) {
    this.selectedProject = project;
    document.body.style.overflow = 'hidden';
  }

  closeProjectDetails() {
    this.selectedProject = null;
    document.body.style.overflow = 'auto';
  }

  viewAllProjects() {
    // This would typically navigate to a dedicated projects page
    this.filteredProjects = [...this.projects];
    this.hasMoreProjects = false;
  }

  formatProjectDate(startDate: Date, endDate?: Date): string {
    const start = startDate.toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });
    
    if (!endDate) {
      return `${start} - Ongoing`;
    }
    
    const end = endDate.toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });
    
    // If same year, show only months
    if (startDate.getFullYear() === endDate.getFullYear()) {
      const startMonth = startDate.toLocaleDateString('en-US', { month: 'short' });
      const endMonth = endDate.toLocaleDateString('en-US', { month: 'short' });
      const year = startDate.getFullYear();
      return `${startMonth} - ${endMonth} ${year}`;
    }
    
    return `${start} - ${end}`;
  }

  trackByProject(index: number, project: Project): string {
    return project.id;
  }
}

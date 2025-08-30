import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface WorkExperience {
  position: string;
  company: string;
  companyLogo: string;
  period: string;
  description: string;
  responsibilities: string[];
}

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.scss',
  animations: [
    trigger('slideInLeft', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-30px)' }),
        animate('0.8s ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ])
  ]
})
export class ExperienceComponent implements OnInit {
  experiences: Experience[] = [];

  constructor(private portfolioService: PortfolioDataService) {}

  ngOnInit() {
    this.portfolioService.getExperiences().subscribe(experiences => {
      this.experiences = experiences;
    });
  }

  formatDateRange(startDate: Date, endDate?: Date): string {
    const start = startDate.toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });
    
    if (!endDate) {
      return `${start} - Present`;
    }
    
    const end = endDate.toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });
    
    return `${start} - ${end}`;
  }

  getTotalYears(): number {
    const startDate = new Date('2019-01-01'); // Career start date
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate.getTime() - startDate.getTime());
    const diffYears = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 365));
    return diffYears;
  }

  getCompanyCount(): number {
    return this.experiences.length;
  }

  getUniqueSkillsCount(): number {
    const allTechnologies = this.experiences.flatMap(exp => exp.technologies);
    const uniqueTechnologies = new Set(allTechnologies);
    return uniqueTechnologies.size;
  }

  calculateDuration(startDate: Date, endDate?: Date): string {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
    const diffMonths = Math.floor((diffTime % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
    
    if (diffYears > 0) {
      return diffMonths > 0 ? `${diffYears}y ${diffMonths}m` : `${diffYears}y`;
    }
    return `${diffMonths}m`;
  }

  getExperienceDescription(experience: Experience): string {
    const descriptions: { [key: string]: string } = {
      'Senior Software Engineer': 'Led development of scalable web applications and mentored junior developers.',
      'Frontend Developer': 'Built responsive user interfaces and optimized application performance.',
      'Full Stack Developer': 'Developed end-to-end solutions using modern web technologies.',
      'Software Engineer': 'Contributed to various projects and implemented new features.'
    };
    return descriptions[experience.position] || 'Contributed to innovative software solutions and team success.';
  }

  getTotalExperience(): number {
    return this.getTotalYears();
  }

  getCompaniesCount(): number {
    return this.getCompanyCount();
  }

  getProjectsCount(): number {
    return this.experiences.length * 8; // Estimate based on experience length
  }
}

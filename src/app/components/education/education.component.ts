import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PortfolioDataService, Education } from '../../services/portfolio-data.service';

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.scss']
})
export class EducationComponent implements OnInit, AfterViewInit {
  @ViewChild('educationSection') educationSection!: ElementRef;
  education: Education[] = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private portfolioService: PortfolioDataService
  ) {}

  ngOnInit() {
    this.portfolioService.getEducation().subscribe(data => {
      this.education = data;
    });
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.setupScrollAnimations();
    }
  }

  trackByEducation(index: number, edu: Education): string {
    return edu.title + edu.date;
  }

  private setupScrollAnimations() {
    if (typeof IntersectionObserver === 'undefined') {
      return;
    }

    let hasAnimated = false;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;
          
          // Simple, clean animation sequence like About component
          setTimeout(() => {
            this.animateElement('.introduction-section', 'animate-fadeInUp');
          }, 100);
          
          setTimeout(() => {
            this.animateElement('.title-section', 'animate-slideInFromBottom');
          }, 300);
          
          setTimeout(() => {
            this.animateElement('.vertical-timeline', 'animate-slideInFromLeft');
          }, 500);
          
          // Animate timeline elements with simpler approach
          setTimeout(() => {
            this.animateTimelineElements();
          }, 700);
          
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    });

    if (this.educationSection) {
      observer.observe(this.educationSection.nativeElement);
    }
  }

  private animateElement(selector: string, animationClass: string) {
    const element = this.educationSection.nativeElement.querySelector(selector);
    if (element) {
      element.classList.add(animationClass);
    }
  }

  private animateTimelineElements() {
    const timelineElements = this.educationSection.nativeElement.querySelectorAll('.vertical-timeline-element');
    timelineElements.forEach((element: Element, index: number) => {
      setTimeout(() => {
        const icon = element.querySelector('.vertical-timeline-element-icon');
        const content = element.querySelector('.vertical-timeline-element-content');
        const date = element.querySelector('.vertical-timeline-element-date');
        const isEven = (index + 1) % 2 === 0;
        
        // Add simple animation classes
        icon?.classList.add('animate-bounce-in');
        
        if (isEven) {
          content?.classList.add('animate-slide-in-right');
          date?.classList.add('animate-date-slide-left');
        } else {
          content?.classList.add('animate-slide-in-left');
          date?.classList.add('animate-date-slide-right');
        }
      }, index * 80); // Even faster staggering for ultra-smooth feel
    });
  }
}

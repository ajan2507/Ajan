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

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Stagger animations
          setTimeout(() => {
            entry.target.querySelector('.introduction-section')?.classList.add('animate-fadeInUp');
          }, 0);
          
          setTimeout(() => {
            entry.target.querySelector('.title-section')?.classList.add('animate-slideInFromBottom');
          }, 200);
          
          setTimeout(() => {
            entry.target.querySelector('.vertical-timeline')?.classList.add('animate-slideInFromLeft');
          }, 400);
          
          // Animate individual timeline elements with staggered sequence
          setTimeout(() => {
            const timelineElements = entry.target.querySelectorAll('.vertical-timeline-element');
            timelineElements.forEach((element: Element, index: number) => {
              // Stagger each timeline element by 400ms
              setTimeout(() => {
                // 1. Icon zooms in first (immediately when animation class is added)
                const icon = element.querySelector('.vertical-timeline-element-icon');
                icon?.classList.add('bounce-in');
                
                // 2. Content slides in from appropriate side (200ms after icon)
                setTimeout(() => {
                  const content = element.querySelector('.vertical-timeline-element-content');
                  const isEven = (index + 1) % 2 === 0;
                  
                  if (isEven) {
                    // Even elements (right side on desktop) slide from right
                    content?.classList.add('slide-in-right');
                  } else {
                    // Odd elements (left side on desktop) slide from left  
                    content?.classList.add('slide-in-left');
                  }
                }, 200);
                
                // 3. Date bounces in from opposite direction (400ms after content starts)
                setTimeout(() => {
                  const date = element.querySelector('.vertical-timeline-element-date');
                  const isEven = (index + 1) % 2 === 0;
                  
                  if (isEven) {
                    // Even elements: date slides from left (opposite of content)
                    date?.classList.add('date-slide-left');
                  } else {
                    // Odd elements: date slides from right (opposite of content)
                    date?.classList.add('date-slide-right');
                  }
                }, 400);
                
              }, index * 400); // Stagger timeline elements by 400ms each
            });
          }, 600);
          
          setTimeout(() => {
            entry.target.querySelector('.footer-section')?.classList.add('animate-fadeInUp');
          }, 1000);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    if (this.educationSection) {
      observer.observe(this.educationSection.nativeElement);
    }
  }
}

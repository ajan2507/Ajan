import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

export interface WorkExperience {
  title: string;
  company_name: string;
  icon: string;
  iconBg: string;
  date: string;
  points: string[];
}

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.6s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(20px)' }),
        animate('0.3s ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('0.2s ease-in', style({ opacity: 0, transform: 'translateX(-20px)' }))
      ])
    ]),
    trigger('staggerCards', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateX(50px)' }),
          stagger('100ms', [
            animate('0.5s ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class ExperienceComponent implements OnInit, AfterViewInit {
  @ViewChild('workExperienceSection') workExperienceSection!: ElementRef;

  activeExperience = 0;
  isInView = false;

  // Experience data - you can add your Bajaj Finserv experience here
  experiences: WorkExperience[] = [
    {
      title: "Software Engineer",
      company_name: "Bajaj Finserv",
      icon: "assets/bajaj-logo.png",
      iconBg: "#ffffff",
      date: "Jan 2024 - Present",
      points: [
        "Developed responsive web applications using Angular framework and TypeScript",
        "Integrated Salesforce (SFDC) solutions for customer relationship management",
        "Collaborated with cross-functional teams to deliver high-quality financial software",
        "Implemented modern web development practices and coding standards",
        "Optimized application performance and user experience across different devices"
      ]
    }
    // Add more experiences here if you have them
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Immediate setup with no delays
      requestAnimationFrame(() => {
        this.setupScrollAnimations();
      });
    }
  }

  selectExperience(index: number) {
    this.activeExperience = index;
  }

  get currentExperience(): WorkExperience {
    return this.experiences[this.activeExperience];
  }

  private setupScrollAnimations() {
    if (typeof IntersectionObserver === 'undefined') {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.isInView = true;
          
          // Immediate animations with no delays
          this.animateElement('.introduction-section', 'animate-fadeInUp');
          this.animateElement('.title-section', 'animate-slideInFromBottom');
          
          const section = entry.target as HTMLElement;
          section.classList.add('animate-in');
          
          // Use requestAnimationFrame for immediate DOM updates
          requestAnimationFrame(() => {
            const layout = section.querySelector('.experience-layout');
            layout?.classList.add('animate');
            
            // Immediate card animations with minimal stagger
            const cards = section.querySelectorAll('.experience-card');
            cards.forEach((card, index) => {
              requestAnimationFrame(() => {
                setTimeout(() => {
                  card.classList.add('animate');
                }, index * 20); // Minimal 20ms stagger
              });
            });
            
            // Details panel animation with minimal delay
            setTimeout(() => {
              const details = section.querySelector('.experience-details');
              details?.classList.add('animate');
            }, 50);
          });
          
          // Disconnect observer after animation
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15, // Slightly higher threshold for instant triggering
      rootMargin: '50px 0px 0px 0px' // Reduced margins for immediate response
    });

    if (this.workExperienceSection) {
      observer.observe(this.workExperienceSection.nativeElement);
    }
  }

  private animateElement(selector: string, animationClass: string) {
    const element = this.workExperienceSection.nativeElement.querySelector(selector);
    if (element) {
      element.classList.add(animationClass);
    }
  }
}

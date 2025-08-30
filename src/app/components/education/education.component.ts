import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.scss']
})
export class EducationComponent {
  educationData = [
    {
      degree: 'Honours Bachelor of Science in Computer Science',
      institution: 'Ontario Tech University',
      period: '2022 - Present',
      description: 'Specializing in software engineering, algorithms, and data structures. Focus on full-stack development, cloud technologies, and system design.',
      courses: [
        'Data Structures & Algorithms',
        'Software Engineering',
        'Database Systems',
        'Computer Networks',
        'Operating Systems',
        'Web Development'
      ]
    }
  ];
}

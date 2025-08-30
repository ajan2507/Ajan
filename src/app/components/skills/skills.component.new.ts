import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface SkillCategory {
  title: string;
  skills: string[];
}

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})
export class SkillsComponent {
  skillCategories: SkillCategory[] = [
    {
      title: 'programming',
      skills: [
        'Python', 'JavaScript', 'TypeScript', 'Java', 'C#', 'SQL', 'HTML/CSS',
        'React', 'Angular', 'Node.js', 'Express.js', 'Django', 'Flask',
        'MongoDB', 'PostgreSQL', 'MySQL', 'Git', 'REST APIs'
      ]
    },
    {
      title: 'itTools',
      skills: [
        'Windows Server', 'Active Directory', 'PowerShell', 'Cisco CUCM',
        'ConnectWise Automate', 'Oracle POS Systems', 'MDT Deployment',
        'VMware vSphere', 'AWS Cloud Services', 'Docker', 'Kubernetes',
        'Jira', 'Confluence', 'PuTTY', 'SecureCRT'
      ]
    },
    {
      title: 'contentProduction',
      skills: [
        'Technical Documentation', 'System Analysis', 'Project Management',
        'Process Automation', 'Troubleshooting', 'User Training',
        'Network Configuration', 'Security Implementation', 'Data Migration',
        'Performance Optimization'
      ]
    }
  ];
}

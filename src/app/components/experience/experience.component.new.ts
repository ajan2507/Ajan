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
  imports: [CommonModule],
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss']
})
export class ExperienceComponent {
  workExperience: WorkExperience[] = [
    {
      position: 'IT Technician',
      company: 'Canada\'s Wonderland',
      companyLogo: 'https://www.sunnypatel.net/assets/wonderland-logo.png',
      period: 'Jun. 2023 - Present',
      description: 'Leading IT infrastructure management and system deployment for one of Canada\'s largest amusement parks.',
      responsibilities: [
        'Provisioned Windows PCs with MDT, and deployed scripting via PowerShell and ConnectWise.',
        'Managed AD accounts to propagate ACLs and unified access across in-house apps, Exchange, and SharePoint.',
        'Configured Cisco CUCM, Unity, and Finesse for stable call routing and voicemail services.',
        'Handled switch patching and VLAN/routing via PuTTY & SecureCRT, ensuring stable network performance.',
        'Deployed Oracle POS/KDS/Debit solutions (EMC, Simphony), tracking updates in Jira & Confluence.'
      ]
    },
    {
      position: 'System Support Specialist',
      company: 'Mackenzie Health',
      companyLogo: 'https://www.sunnypatel.net/assets/mackenzie-health-logo.png',
      period: 'Sep. 2022 - May 2023',
      description: 'Provided comprehensive IT support for healthcare systems and infrastructure in a hospital environment.',
      responsibilities: [
        'Maintained and troubleshot healthcare IT systems and medical equipment interfaces.',
        'Provided technical support for EMR systems and clinical applications.',
        'Implemented security protocols and compliance measures for healthcare data.',
        'Collaborated with clinical staff to resolve IT issues and improve system efficiency.',
        'Documented procedures and maintained detailed incident reports.'
      ]
    },
    {
      position: 'Tech Sales Associate',
      company: 'Staples Canada',
      companyLogo: 'https://www.sunnypatel.net/assets/staples-logo.png',
      period: 'Jan. 2021 - Aug. 2022',
      description: 'Co-op position focused on technical sales, customer support, and technology consulting.',
      responsibilities: [
        'Provided technical consultation and product recommendations to customers.',
        'Assisted with technology setup, configuration, and troubleshooting.',
        'Managed inventory and maintained product knowledge of latest technology trends.',
        'Developed strong customer service and communication skills.',
        'Achieved sales targets while ensuring customer satisfaction.'
      ]
    }
  ];
}

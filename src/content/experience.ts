export interface Role {
  company: string
  title: string
  start: string
  end: string
  location: string
  summary: string
  points: string[]
  stack: string[]
  placeholder?: boolean
}

export const experience: Role[] = [
  {
    company: 'RushHour Digital Ltd.',
    title: 'Web Developer',
    start: 'Apr 2024',
    end: 'Present',
    location: 'Remote',
    summary:
      'Design, build and maintain custom websites for clients including Equities First, DayOne, Lexibook, Ural & Uramet, SchoolChoice HK and Optism, from development through production deployment.',
    points: [
      'Deliver and maintain 5+ client websites on WordPress (monolithic and headless with Next.js) and Drupal + Next.js',
      'Build custom WordPress themes and plugins in PHP, extending the CMS and exposing custom API endpoints for client-specific needs',
      'Integrate third-party payment, email and analytics services, and configure technical SEO and Google Tag Manager across client sites',
      'Raise Lighthouse performance scores to 90+ on key pages through asset optimization, caching and query tuning',
      'Partner with designers and project managers to work through client UAT feedback, fix production issues and ship enhancements',
    ],
    stack: ['WordPress', 'PHP', 'Drupal', 'Next.js', 'Google Tag Manager'],
  },
  {
    company: 'Simplevia Technologies Inc.',
    title: 'Intermediate Software Engineer',
    start: 'Mar 2023',
    end: 'Apr 2024',
    location: 'Pasig City',
    summary:
      'Built and maintained production systems for government accounting, document signing and logistics, and mentored junior engineers.',
    points: [
      'Developed and maintained Makati AIS (Accounting Information System), Makati E-Sign (digital document signing) and LMIIS (Logistics Management Inventory and Information System)',
      'Automated accounting and payroll document review, approval and processing, raising team productivity and task completion by about 35%',
      'Owned features across the full SDLC, gathering requirements with users, analysts and stakeholders to meet UX, business and compliance needs',
      'Mentored junior engineers and advised other teams on application design and issue resolution',
    ],
    stack: [],
  },
  {
    company: 'Revlv Solutions Inc.',
    title: 'Junior Software Engineer',
    start: 'Jan 2021',
    end: 'Feb 2023',
    location: 'Makati City',
    summary:
      'Part of a four-person team that designed, built, tested, deployed and documented custom web applications with frequent releases.',
    points: [
      'Delivered 5+ custom web applications, including a Document Archiving system, a membership system for Astoria Vacation & Leisure Club (AVLCI), a Farmer Information System and RisToken',
      'Built frontend and backend features from design and implementation through testing, deployment and documentation',
      'Managed version control, code integration and frequent server releases through Git-based workflows',
      'Diagnosed and fixed application defects, cutting recurring production issues by about 20%',
    ],
    stack: [],
  },
]

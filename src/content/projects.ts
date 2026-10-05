export interface Project {
  slug: string
  name: string
  tagline: string
  year: string
  role: string
  /** who the work was done for/at; projects are grouped by this */
  company: string
  stack: string[]
  summary: string
  highlights: string[]
  links: { label: string; href: string }[]
  /** colour used for the project's cover field and monogram */
  tint: string
  /** site favicon in /public/favicons; falls back to a monogram */
  icon?: string
  /** number of screenshots in /public/projects/<slug>/ (1.webp, 1-thumb.webp, …) */
  shots?: number
  placeholder?: boolean
}

const RUSHHOUR = 'RushHour Digital'
const SIMPLEVIA = 'Simplevia Technologies'
const REVLV = 'Revlv Solutions'
const PERSONAL = 'Personal'

/** display order of the groups in the Projects app */
export const projectGroups = [RUSHHOUR, SIMPLEVIA, REVLV, PERSONAL]

export const projects: Project[] = [
  // ── RushHour Digital ──────────────────────────────────────────────
  {
    slug: 'equities-first',
    name: 'Equities First',
    tagline: 'Multilingual corporate site serving 10+ regional editions in 6 languages',
    year: '2026',
    role: 'Co-developer',
    company: RUSHHOUR,
    stack: ['WordPress', 'PHP', 'Localization'],
    summary:
      'A multilingual WordPress corporate site with 10+ regional editions in English, Arabic, Thai, Korean, and Simplified and Traditional Chinese. Co-developed with one other developer and launched in about a month.',
    highlights: [
      'Serves 10+ regional editions across 6 languages, including right-to-left Arabic',
      'Co-developed and launched in roughly one month with one other developer',
      'Ongoing enhancements, bug fixes and content updates after launch',
    ],
    links: [{ label: 'Visit site', href: 'https://equitiesfirst.com/' }],
    tint: '#e95420',
    icon: '/favicons/equities-first.png',
    shots: 5,
  },
  {
    slug: 'dayone-dc',
    name: 'DayOne DC',
    tagline: 'Headless WordPress CMS powering a Next.js frontend',
    year: '2026',
    role: 'Sole developer',
    company: RUSHHOUR,
    stack: ['WordPress', 'Next.js', 'PHP', 'REST APIs'],
    summary:
      'Architected and built a headless WordPress CMS behind a Next.js frontend for DayOne, a data center company operating across Asia-Pacific and Europe, taking the site from implementation to production deployment on my own.',
    highlights: [
      'Core site launched in about 1.5 months, including two rounds of client UAT revisions',
      'Handled content migration, CMS updates and post-launch maintenance',
    ],
    links: [{ label: 'Visit site', href: 'https://dayonedc.com/' }],
    tint: '#03875b',
    icon: '/favicons/dayone-dc.png',
    shots: 5,
  },
  {
    slug: 'ural-uramet',
    name: 'Ural Uramet',
    tagline: 'Custom WordPress theme built to approved designs',
    year: '2025',
    role: 'Sole developer',
    company: RUSHHOUR,
    stack: ['WordPress', 'PHP', 'CSS3'],
    summary:
      'A fully responsive corporate site built on a custom WordPress theme, delivered independently to specification from approved designs.',
    highlights: [
      'Custom theme built from approved designs to specification',
      'Fully responsive across devices',
      'Worked with designers and project managers through development, testing and launch',
    ],
    links: [{ label: 'Visit site', href: 'https://ural-uramet.com.au/' }],
    tint: '#0073e5',
    icon: '/favicons/ural-uramet.png',
    shots: 6,
  },
  {
    slug: 'lexibook',
    name: 'Lexibook',
    tagline: 'Multilingual e-commerce on Drupal with a Next.js frontend',
    year: '2025',
    role: 'Developer, cross-functional team',
    company: RUSHHOUR,
    stack: ['Drupal', 'Next.js', 'PHP', 'Localization'],
    summary:
      'Developed and maintained features for a bilingual e-commerce platform built on Drupal with a Next.js frontend, working within a cross-functional team.',
    highlights: [
      'English and French localization for a bilingual customer base',
      'Reworked product search and navigation so shoppers reach a product page in fewer steps',
      'Cut average page load time by about 30% with frontend and backend optimization',
    ],
    links: [{ label: 'Visit site', href: 'https://www.lexibookpro.com/' }],
    tint: '#da3450',
    icon: '/favicons/lexibook.png',
    shots: 5,
  },
  {
    slug: 'schoolchoice-hk',
    name: 'SchoolChoice HK',
    tagline: 'School directory and parent resources for Hong Kong families',
    year: '2025',
    role: 'Developer',
    company: RUSHHOUR,
    stack: [],
    summary: 'A Chinese-language site that helps Hong Kong parents search for and compare schools for their children.',
    highlights: [],
    links: [{ label: 'Visit site', href: 'https://schoolchoice.hk/' }],
    tint: '#4b8501',
    icon: '/favicons/schoolchoice-hk.png',
    shots: 6,
  },
  {
    slug: 'latitude-pilot',
    name: 'Latitude – Pilot',
    tagline: 'PILOT°, an online P&I insurance comparison tool',
    year: '2025',
    role: 'Developer',
    company: RUSHHOUR,
    stack: ['Next.js'],
    summary:
      'Marketing site for PILOT° by Filhet-Allard Maritime, the first online comparison tool for International Group P&I Clubs, now covering Fixed Premium P&I and Charterers’ insurers.',
    highlights: [],
    links: [{ label: 'Visit site', href: 'https://pilotpandi.com/' }],
    tint: '#308280',
    icon: '/favicons/latitude-pilot.png',
    shots: 3,
  },
  {
    slug: 'optism',
    name: 'Optism',
    tagline: 'Parent support and resources for autism in Asia',
    year: '2024',
    role: 'Developer',
    company: RUSHHOUR,
    stack: ['Drupal', 'Next.js'],
    summary:
      'Delivered UI, functionality and performance improvements to Optism’s existing Drupal + Next.js site, a resource hub for parents of autistic children in Asia, as requirements evolved.',
    highlights: [
      'UI, functionality and performance improvements as requirements changed',
      'Diagnosed and resolved site issues to improve stability and user experience',
    ],
    links: [{ label: 'Visit site', href: 'https://optism.co/' }],
    tint: '#308280',
    icon: '/favicons/optism.png',
    shots: 6,
  },

  // ── Simplevia Technologies ────────────────────────────────────────
  {
    slug: 'makati-ais',
    name: 'Makati AIS',
    tagline: 'Accounting Information System for the City of Makati',
    year: '2023',
    role: 'Intermediate Software Engineer',
    company: SIMPLEVIA,
    stack: [],
    summary:
      'A production accounting system covering payroll and remittances, supply and property, budget, chart of accounts, bookkeeping and financial reporting.',
    highlights: [
      'Automated accounting and payroll document review, approval and processing',
      'Raised team productivity and task completion by about 35%',
    ],
    links: [],
    tint: '#c88800',
    shots: 5,
  },
  {
    slug: 'makati-esign',
    name: 'Makati E-Sign',
    tagline: 'Digital document signing for the City of Makati',
    year: '2023',
    role: 'Intermediate Software Engineer',
    company: SIMPLEVIA,
    stack: [],
    summary: 'A production system for signing documents digitally, replacing paper sign-off on internal documents.',
    highlights: ['Requirements gathered with users, analysts and stakeholders to meet UX, business and compliance needs'],
    links: [],
    tint: '#0073e5',
    shots: 6,
  },
  {
    slug: 'lmiis',
    name: 'LMIIS',
    tagline: 'Logistics Management Inventory and Information System',
    year: '2024',
    role: 'Intermediate Software Engineer',
    company: SIMPLEVIA,
    stack: [],
    summary:
      'A logistics system with procurement, supply, general service, track-and-trace and administration modules.',
    highlights: ['Owned features across the full SDLC, from requirements to release'],
    links: [],
    tint: '#787859',
    shots: 6,
  },

  // ── Revlv Solutions ───────────────────────────────────────────────
  {
    slug: 'document-archiving',
    name: 'Document Archiving',
    tagline: 'File sharing, routing, approval and archiving',
    year: '2022',
    role: 'Junior Software Engineer',
    company: REVLV,
    stack: [],
    summary:
      'A document management system for sharing, routing and approving files, with archiving, notifications and encrypted file storage.',
    highlights: [],
    links: [],
    tint: '#c7162b',
    shots: 7,
  },
  {
    slug: 'avlci',
    name: 'AVLCI',
    tagline: 'Membership system for Astoria Vacation & Leisure Club',
    year: '2022',
    role: 'Junior Software Engineer',
    company: REVLV,
    stack: [],
    summary: 'A membership management system built for Astoria Vacation & Leisure Club Inc.',
    highlights: [],
    links: [],
    tint: '#4b8501',
    shots: 4,
  },
  {
    slug: 'farmer-information-system',
    name: 'Farmer Information System',
    tagline: 'Farmer profiles, farms and assistance records',
    year: '2021',
    role: 'Junior Software Engineer',
    company: REVLV,
    stack: [],
    summary:
      'A registry of farmer profiles covering farms and farming systems, assistance and interventions received, and the problems each farmer faces.',
    highlights: [],
    links: [],
    tint: '#03875b',
    shots: 4,
  },
  {
    slug: 'ristoken',
    name: 'RisToken',
    tagline: 'Token tracking with comparison charts',
    year: '2021',
    role: 'Junior Software Engineer',
    company: REVLV,
    stack: [],
    summary: 'A web application for tracking tokens, with charts comparing them across companies.',
    highlights: [],
    links: [],
    tint: '#7764d8',
    shots: 4,
  },

  // ── Personal ──────────────────────────────────────────────────────
  {
    slug: 'admin-content-manager',
    name: 'Admin Content Manager',
    tagline: 'Content admin for posts, reviews, threads and protocols',
    year: '2025',
    role: 'Personal project',
    company: PERSONAL,
    stack: ['React'],
    summary:
      'An admin dashboard for managing mixed content types — practitioners, blog posts, reviews, forum threads and protocols — with tagging and visibility controls.',
    highlights: ['Filter content by type, visibility and tag', 'Create and manage entries across five content types'],
    links: [{ label: 'Live demo', href: 'https://admin-content-manager.netlify.app/' }],
    tint: '#b34cb3',
  },
  {
    slug: 'todo-app',
    name: 'To Do App',
    tagline: 'A simple task list built with Vue',
    year: '2024',
    role: 'Personal project',
    company: PERSONAL,
    stack: ['Vue.js'],
    summary: 'A lightweight to-do list for adding and tracking tasks.',
    highlights: ['Add and manage tasks in a single view'],
    links: [{ label: 'Live demo', href: 'https://jowie-jurado-todo-app.netlify.app/' }],
    tint: '#c88800',
  },
  {
    slug: 'voting-system',
    name: 'Voting System',
    tagline: 'An online voting application built with Laravel',
    year: '2025',
    role: 'Personal project',
    company: PERSONAL,
    stack: ['Laravel', 'PHP'],
    summary: 'A web-based voting system built on Laravel.',
    highlights: [],
    links: [],
    tint: '#657b69',
  },
]

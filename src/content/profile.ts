/**
 * Portfolio content, sourced from the CV (public/Jowie-Trence-Jurado-CV.pdf).
 */
export const profile = {
  name: 'Jowie Trence Jurado',
  handle: 'jowie',
  // shown in the terminal prompt and neofetch
  hostname: 'jowie-trence-jurado',
  role: 'PHP & WordPress Developer',
  // profile photo in /public (leave empty to show initials)
  avatar: '/avatar.webp',
  location: 'Bulacan, Philippines',
  bio: [
    'I’m a PHP and WordPress developer with 5+ years of experience building and maintaining production websites and web applications. I specialize in custom WordPress themes and plugins across monolithic and headless (WordPress + Next.js) builds, alongside Drupal, Laravel and plain PHP backends.',
    'I’ve delivered 8+ client websites, including a multilingual corporate site serving 10+ regions that launched in about a month, and raised a team’s productivity by roughly 35% by automating document workflows.',
    'Day to day I work on REST API and third-party integrations, technical SEO and performance. I value clean, maintainable code, work closely with designers and project managers, and enjoy mentoring junior engineers.',
  ],
  // e.g. 'Open to new opportunities'; hidden while empty
  availability: '',
  email: 'juradojowietrence@gmail.com',
  github: 'jowiejurado',
  // résumé link (leave empty to hide)
  resumeUrl: '/Jowie-Trence-Jurado-CV.pdf',
  skills: {
    'PHP & Backend': ['PHP', 'Laravel', 'REST APIs', 'MySQL', 'MariaDB', 'PostgreSQL', 'Node.js'],
    CMS: ['WordPress', 'Drupal', 'FilamentPHP'],
    Frontend: ['JavaScript', 'TypeScript', 'jQuery', 'HTML5', 'CSS3', 'Tailwind CSS', 'React', 'Next.js', 'Vue.js', 'Nuxt.js', 'Vuetify'],
    'Integrations & SEO': ['Stripe', 'Third-party APIs', 'AI APIs', 'Google Tag Manager', 'Technical SEO', 'Localization'],
    'Tools & Workflow': ['Git', 'GitHub', 'Docker', 'UAT', 'Agile / SDLC'],
  } as Record<string, string[]>,
}

export type Social = { label: string; href: string; handle: string }

export const socials: Social[] = [
  { label: 'GitHub', href: 'https://github.com/jowiejurado', handle: '@jowiejurado' },
  { label: 'Email', href: 'mailto:juradojowietrence@gmail.com', handle: 'juradojowietrence@gmail.com' },
]

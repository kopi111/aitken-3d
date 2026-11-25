export const TIKTOK_URL = 'https://www.tiktok.com/@aitkentechnology'

export const PROJECTS = [
  {
    id: 'summer-splash',
    title: 'Summer Splash Pool Services',
    kind: 'Website',
    image: '/projects/summer-splash.jpg',
    aspect: 1440 / 900,
    summary: 'The website we built for a Florida pool company.',
    points: ['Mobile-first design', 'Service pages', 'Customer reviews on the page', 'Free-quote request form'],
    link: { label: 'Visit the site', url: 'https://kopi111.github.io/summer-splash/' },
  },
  {
    id: 'money-path',
    title: 'Money Path',
    kind: 'Mobile app',
    image: '/projects/money-path.jpg',
    aspect: 720 / 1600,
    summary: 'Our own budgeting app for Android.',
    points: ['PIN lock with optional fingerprint', 'Data encrypted on the phone', 'Works with no internet', 'Savings goals that show on track or behind'],
  },
  {
    id: 'aitken-shipping',
    title: 'Aitken Shipping',
    kind: 'Web app',
    image: '/projects/aitken-shipping.jpg',
    aspect: 1440 / 900,
    summary: 'A courier website we built to show what a courier business can have online.',
    points: ['Instant shipping quote', 'Book a shipment', 'Track a parcel'],
  },
]

export const SERVICES = [
  { id: 'websites', title: 'Websites', summary: 'Fast, mobile-first sites that bring customers to you.', points: ['Business and portfolio sites', 'Quote and contact forms', 'Built to be found on Google'] },
  { id: 'web-apps', title: 'Web apps', summary: 'Booking, tracking, dashboards and admin portals that run your business.', points: ['Customer accounts and logins', 'Admin dashboards', 'Payments and bookings'] },
  { id: 'mobile-apps', title: 'Mobile apps', summary: 'Android and iPhone apps from one codebase.', points: ['Works offline', 'Secure sign-in', 'Published to the app stores'] },
]

export const CONTACT = {
  title: 'Let’s build yours',
  summary: 'Got an idea for a website or app? Message us on TikTok.',
  points: ['Comment WEBSITE on any of our videos and we’ll DM you'],
  link: { label: 'Open @aitkentechnology', url: TIKTOK_URL },
}

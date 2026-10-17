const paths: Record<string, React.ReactNode> = {
  code: <><path d="m8 7-5 5 5 5" /><path d="m16 7 5 5-5 5" /><path d="m14 4-4 16" /></>,
  layers: <><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 13 9 5 9-5" /></>,
  smartphone: <><rect x="7" y="2.5" width="10" height="19" rx="2.5" /><path d="M11 18.5h2" /></>,
  cloud: <path d="M7 18a4.5 4.5 0 0 1-.6-8.96A6 6 0 0 1 18 9.5a4.25 4.25 0 0 1-.5 8.5H7Z" />,
  workflow: <><rect x="3" y="3" width="6" height="6" rx="1.5" /><rect x="15" y="15" width="6" height="6" rx="1.5" /><path d="M9 6h3a3 3 0 0 1 3 3v6" /></>,
  cart: <><circle cx="9" cy="20" r="1.3" /><circle cx="18" cy="20" r="1.3" /><path d="M2 3h3l2.4 11.2a1.5 1.5 0 0 0 1.5 1.2h8.5a1.5 1.5 0 0 0 1.5-1.1L21 7H6" /></>,
  plug: <><path d="M9 3v5M15 3v5" /><path d="M6 8h12v3a6 6 0 0 1-12 0V8Z" /><path d="M12 17v4" /></>,
  lifebuoy: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3.5" /><path d="m5.6 5.6 3.9 3.9M14.5 14.5l3.9 3.9M18.4 5.6l-3.9 3.9M9.5 14.5l-3.9 3.9" /></>,
  building: <><rect x="4" y="3" width="11" height="18" rx="1.5" /><path d="M15 9h4a1 1 0 0 1 1 1v11H15M8 7h3M8 11h3M8 15h3" /></>,
  graduation: <><path d="m2 9 10-5 10 5-10 5L2 9Z" /><path d="M6 11.5V16c0 1.4 2.7 3 6 3s6-1.6 6-3v-4.5" /></>,
  users: <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0" /><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.3a6.5 6.5 0 0 1 3.5 5.7" /></>,
  terminal: <><rect x="3" y="4" width="18" height="16" rx="2.5" /><path d="m7 9 3 3-3 3M13 15h4" /></>,
  template: <><rect x="3" y="3" width="18" height="18" rx="2.5" /><path d="M3 9h18M9 21V9" /></>,
  shield: <><path d="M12 3 4.5 6v5.5c0 4.6 3.1 8.1 7.5 9.5 4.4-1.4 7.5-4.9 7.5-9.5V6L12 3Z" /><path d="m9 12 2.2 2.2L15.5 10" /></>,
  book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z" /><path d="M4 21.5A2.5 2.5 0 0 1 6.5 19H20" /></>,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  search: <><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.2-4.2" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="m3.5 7 8.5 6 8.5-6" /></>,
  bug: <><rect x="8" y="7" width="8" height="13" rx="4" /><path d="M12 7V4M5 11h3M16 11h3M5 17h3M16 17h3M9 4l1.5 2M15 4l-1.5 2" /></>,
  file: <><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" /><path d="M14 3v5h5M9 13h6M9 17h6" /></>,
  wrench: <path d="M14.5 6.5a4 4 0 0 0 4.9 4.9L9.7 21a2.1 2.1 0 0 1-3-3l9.6-9.6A4 4 0 0 0 14.5 6.5Z" />,
  linkedin: <><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M8 10v7M8 7.2v.1M12 17v-4a2.5 2.5 0 0 1 5 0v4M12 10v7" /></>,
  x: <path d="m4 4 16 16M20 4 4 20" />,
  github: <path d="M9 19c-4 1.3-4-2-6-2.5m12 4.5v-3.3a2.9 2.9 0 0 0-.8-2.2c2.700-.3 5.500-1.300 5.500-6a4.700 4.700 0 0 0-1.300-3.300 4.400 4.400 0 0 0-.1-3.300s-1-.3-3.400 1.300a11.600 11.600 0 0 0-6 0C6.500 2.600 5.500 2.900 5.500 2.900a4.400 4.400 0 0 0-.1 3.300A4.700 4.700 0 0 0 4 9.500c0 4.600 2.800 5.700 5.500 6A2.900 2.900 0 0 0 8.700 17.700V21" />,
  youtube: <><rect x="2.5" y="5" width="19" height="14" rx="4" /><path d="m10 9 5 3-5 3V9Z" /></>,
  facebook: <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8.500A.5.5 0 0 1 14 8Z" />,
  instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><path d="M17.500 6.500v.01" /></>,
};

export function Icon({ name, size = 22, className }: { name: string; size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {paths[name] ?? paths.code}
    </svg>
  );
}

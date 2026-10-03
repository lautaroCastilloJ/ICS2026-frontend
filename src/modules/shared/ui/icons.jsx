// Iconos de trazo fino. Heredan el color del texto (currentColor) y son
// decorativos: el nombre accesible lo pone el boton o enlace que los contiene.

function Icon({ size = 20, strokeWidth = 1.6, children, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export const SearchIcon = (props) => (
  <Icon strokeWidth={1.8} {...props}><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></Icon>
);

export const UserIcon = (props) => (
  <Icon {...props}><circle cx="12" cy="8" r="4" /><path d="M4 20c1.5-4 4.5-6 8-6s6.5 2 8 6" /></Icon>
);

export const BagIcon = (props) => (
  <Icon {...props}><path d="M6 8h12l-1 12H7L6 8z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></Icon>
);

export const SunIcon = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4L6 18M18 6l1.4-1.4" />
  </Icon>
);

export const MoonIcon = (props) => (
  <Icon {...props}><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" /></Icon>
);

export const ImageIcon = (props) => (
  <Icon strokeWidth={1.2} {...props}>
    <rect x="3" y="4" width="18" height="16" rx="3" /><circle cx="9" cy="10" r="2" /><path d="M21 16l-5-5-8 8" />
  </Icon>
);

export const MinusIcon = (props) => (
  <Icon strokeWidth={1.8} {...props}><path d="M5 12h14" /></Icon>
);

export const PlusIcon = (props) => (
  <Icon strokeWidth={1.8} {...props}><path d="M5 12h14M12 5v14" /></Icon>
);

export const ChevronLeftIcon = (props) => (
  <Icon strokeWidth={2} {...props}><path d="M15 18l-6-6 6-6" /></Icon>
);

export const CloseIcon = (props) => (
  <Icon strokeWidth={1.8} {...props}><path d="M6 6l12 12M18 6L6 18" /></Icon>
);

export const TrashIcon = (props) => (
  <Icon {...props}>
    <path d="M4 7h16M10 11v6M14 11v6M5.5 7l1 12a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2l1-12M9 7V4.5A1.5 1.5 0 0 1 10.5 3h3A1.5 1.5 0 0 1 15 4.5V7" />
  </Icon>
);

export const GridIcon = (props) => (
  <Icon {...props}>
    <rect x="4" y="4" width="7" height="7" rx="2" /><rect x="13" y="4" width="7" height="7" rx="2" />
    <rect x="4" y="13" width="7" height="7" rx="2" /><rect x="13" y="13" width="7" height="7" rx="2" />
  </Icon>
);

export const BoxIcon = (props) => (
  <Icon {...props}>
    <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" /><path d="M4 7.5l8 4.5 8-4.5M12 12v9" />
  </Icon>
);

export const ReceiptIcon = (props) => (
  <Icon {...props}>
    <path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3z" /><path d="M9 8h6M9 12h6" />
  </Icon>
);

export const ShieldIcon = (props) => (
  <Icon {...props}><path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z" /><path d="M9 12l2 2 4-4" /></Icon>
);

export const KeyIcon = (props) => (
  <Icon {...props}><circle cx="8" cy="15" r="4" /><path d="M11 12l9-9M17 6l3 3M15 8l2 2" /></Icon>
);

export const LogoutIcon = (props) => (
  <Icon {...props}><path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 16l-4-4 4-4M6 12h10" /></Icon>
);

export const MenuIcon = (props) => (
  <Icon {...props}><path d="M4 8h16M4 16h16" /></Icon>
);

export const StoreIcon = (props) => (
  <Icon {...props}><path d="M4 9l1.5-5h13L20 9M4 9v11h16V9M4 9h16M9 20v-6h6v6" /></Icon>
);

export const PencilIcon = (props) => (
  <Icon {...props}><path d="M14.5 5.5l4 4M4 20l1-5L15.5 4.5a1.4 1.4 0 0 1 2 0l2 2a1.4 1.4 0 0 1 0 2L9 19l-5 1z" /></Icon>
);

export const ArrowRightIcon = (props) => (
  <Icon strokeWidth={1.8} {...props}><path d="M5 12h14M13 6l6 6-6 6" /></Icon>
);

export const CheckIcon = (props) => (
  <Icon strokeWidth={2} {...props}><path d="M5 12.5l4.5 4.5L19 7.5" /></Icon>
);

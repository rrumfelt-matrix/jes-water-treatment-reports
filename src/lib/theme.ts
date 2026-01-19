// Jasper Equipment & Supply Brand Theme
export const theme = {
  colors: {
    // Primary Navy Blue
    primary: '#1e3a5f',
    primaryLight: '#2c5282',
    primaryDark: '#1a365d',

    // Accent Blue
    accent: '#3182ce',
    accentLight: '#4299e1',

    // Backgrounds
    bgPrimary: '#ffffff',
    bgSecondary: '#f7fafc',
    bgTertiary: '#edf2f7',

    // Text
    textPrimary: '#1a202c',
    textSecondary: '#4a5568',
    textMuted: '#718096',
    textLight: '#a0aec0',

    // Status
    success: '#38a169',
    warning: '#d69e2e',
    error: '#c53030',

    // Borders
    border: '#e2e8f0',
    borderDark: '#cbd5e0',
  },

  // RGB values for PDF generation
  rgb: {
    primary: [30, 58, 95],
    primaryLight: [44, 82, 130],
    accent: [49, 130, 206],
    bgSecondary: [247, 250, 252],
    bgTertiary: [237, 242, 247],
    textPrimary: [26, 32, 44],
    textSecondary: [74, 85, 104],
    white: [255, 255, 255],
  },
} as const;

// Tailwind-compatible class names
export const themeClasses = {
  primaryBg: 'bg-[#1e3a5f]',
  primaryText: 'text-[#1e3a5f]',
  primaryBorder: 'border-[#1e3a5f]',
  primaryHover: 'hover:bg-[#2c5282]',
  accentBg: 'bg-[#3182ce]',
  accentText: 'text-[#3182ce]',
  accentHover: 'hover:bg-[#4299e1]',
};

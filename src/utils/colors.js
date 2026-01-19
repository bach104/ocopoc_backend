const colors = {
  // Reset
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',

  // Foreground colors
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m',

  // Bright colors
  brightRed: '\x1b[91m',
  brightGreen: '\x1b[92m',
  brightYellow: '\x1b[93m',
  brightBlue: '\x1b[94m',
  brightMagenta: '\x1b[95m',
  brightCyan: '\x1b[96m',
  brightWhite: '\x1b[97m',

  // Background colors
  bgBlack: '\x1b[40m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m',
  bgGray: '\x1b[100m',
};

const colorize = {
  // Basic color functions
  success: (text) => `${colors.brightGreen}✓ ${text}${colors.reset}`,
  error: (text) => `${colors.brightRed}✗ ${text}${colors.reset}`,
  warning: (text) => `${colors.brightYellow}⚠ ${text}${colors.reset}`,
  info: (text) => `${colors.brightCyan}ℹ ${text}${colors.reset}`,
  highlight: (text) => `${colors.bright}${colors.brightYellow}${text}${colors.reset}`,
  bold: (text) => `${colors.bright}${text}${colors.reset}`,
  
  registered: (text) => `${colors.brightGreen}🎉 ${text}${colors.reset}`,
  token: (text) => `${colors.brightMagenta}🔑 ${text}${colors.reset}`,
  user: (text) => `${colors.brightCyan}👤 ${text}${colors.reset}`,
  email: (text) => `${colors.brightBlue}📧 ${text}${colors.reset}`,
  password: (text) => `${colors.brightRed}🔒 ${text}${colors.reset}`,
  
  section: (text) => `${colors.bright}${colors.underscore}${colors.brightCyan}${text}${colors.reset}`,
  
  json: (text) => `${colors.brightYellow}${JSON.stringify(text, null, 2)}${colors.reset}`,
  
  divider: () => `${colors.gray}${'─'.repeat(60)}${colors.reset}`,
};

module.exports = { colors, colorize };
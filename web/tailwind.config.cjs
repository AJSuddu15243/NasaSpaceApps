const fs = require('node:fs');
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  presets: fs.existsSync('./src/design/tailwind.preset.cjs') ? [require('./src/design/tailwind.preset.cjs')] : [],
};

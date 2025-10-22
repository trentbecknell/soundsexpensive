# Artist Roadmap Installation Guide

A comprehensive web application for planning music projects, with AI-guided assessment, budgeting, and timeline generation.

## Requirements

- Node.js (v18 or newer)
- npm (comes with Node.js)
- Modern web browser (Chrome, Firefox, Safari, or Edge)

## Quick Installation

1. Clone the repository or unzip the project files
2. Open a terminal and navigate to the project:
   ```bash
   cd path/to/artist-roadmap
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start development server:
   ```bash
   npm run dev
   ```
5. Open in your browser:
   ```
   http://localhost:5173
   ```

## Features

### Core Features
- Project planning and assessment
- Budget management
- Timeline generation
- Progress tracking
- Data persistence
- Project sharing via URL

### New Features
- AI-guided assessment wizard
- Interactive chat assistance
- Contextual suggestions
- Enhanced project visualization
- Responsive layout improvements

## Development Tools

For the best development experience:

1. Install Visual Studio Code
2. Recommended extensions:
   - ESLint
   - Prettier
   - Tailwind CSS IntelliSense
   - TypeScript support

## Building for Production

To deploy the application:

1. Create production build:
   ```bash
   npm run build
   ```
2. The `dist` folder will contain static files
3. Preview production build:
   ```bash
   npm run preview
   ```
4. Deploy to any static hosting service:
   - Netlify
   - Vercel
   - GitHub Pages
   - Any web server

## Data and Storage

- All data persists in browser localStorage
- Key: `artist-roadmap-vite-v1`
- Export/import functionality for backup
- URL sharing for collaboration

## Browser Support

Tested and supported in:
- Chrome 90+
- Firefox 90+
- Safari 14+
- Edge 90+

## Need Help?

1. Check the DEMO.md for feature guides
2. Read the README.md for overview
3. Review inline documentation
4. Contact project maintainers

## Contributing

See README.md for contribution guidelines.

## License

MIT License - See LICENSE file for details.
# Artist Roadmap (Vite + React + TS)

Plan projects, estimate budgets, and generate a go‑to‑market timeline for music releases, with AI-assisted guidance.

## Features

- 🎯 Project planning and maturity assessment
- 💬 AI-guided assessment help with contextual suggestions
- 📊 Budget estimation and tracking
- 📅 Automated timeline generation
- 🔄 Progress tracking and phase management
- 📱 Responsive design for all devices
- 🔗 Share projects via URL

## Quick Start

1. Clone the repository:
```bash
git clone https://github.com/yourusername/artist-roadmap.git
cd artist-roadmap
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Open http://localhost:5173 in your browser

## Build for Production

```bash
npm run build
npm run preview   # Test production build locally
```

The `dist/` folder will contain static files ready to deploy to any hosting service.

## Project Structure

- `src/components/` - React components including Chat and AssessmentWizard
- `src/data/` - Assessment questions, chat prompts, and helper text
- `src/lib/` - Utility functions and stage computation logic

## Technical Stack

- 🛠 Vite for fast development and builds
- ⚛️ React 18 with TypeScript
- 🎨 Tailwind CSS for styling
- 📈 Recharts for data visualization
- 💾 LocalStorage for persistence
- 🔗 URL hash for project sharing

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## Notes

- No backend required - all data is stored in localStorage
- Projects can be shared via URL hash
- Assessment wizard includes AI chat help for guided project planning

## License

MIT License - feel free to use in your own projects!

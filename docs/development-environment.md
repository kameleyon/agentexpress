# Development Environment Setup

This document provides instructions for setting up the development environment for the AgentExpress project.

## Prerequisites

- Node.js (v18 or later)
- npm (v9 or later)
- Git
- Visual Studio Code (recommended)
- Docker (for local database and services)

## Initial Setup

### 1. Clone the Repository

```bash
git clone https://github.com/kameleyon/agentexpress.git
cd agentexpress
```

### 2. Install Dependencies

```bash
# Install root project dependencies
npm install

# Install Expo mobile app dependencies
cd agentexpress
npm install
cd ..
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```
# API Keys
OPENAI_API_KEY=your_openai_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Database
DATABASE_URL=your_database_url

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# Other Services
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

For the Expo mobile app, create a `.env` file in the `agentexpress` directory:

```
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

### 4. Set Up Supabase Local Development

```bash
# Install Supabase CLI
npm install -g supabase

# Start Supabase local development
supabase start
```

### 5. Set Up Database

```bash
# Run database migrations
npx prisma migrate dev
```

## Development Workflow

### Running the Web Application

```bash
# Start the development server
npm run dev
```

The web application will be available at http://localhost:3000.

### Running the Mobile Application

```bash
# Navigate to the mobile app directory
cd agentexpress

# Start the Expo development server
npm start
```

Follow the instructions in the terminal to open the app on your device or emulator.

### Running Tests

```bash
# Run unit and integration tests
npm test

# Run end-to-end tests
npm run test:e2e
```

### Linting and Formatting

```bash
# Run ESLint
npm run lint

# Fix ESLint issues
npm run lint:fix

# Check formatting with Prettier
npm run format:check

# Fix formatting issues
npm run format
```

## Docker Development Environment

For a fully containerized development environment, you can use Docker Compose:

```bash
# Start the development environment
docker-compose up -d

# Stop the development environment
docker-compose down
```

## VS Code Configuration

We recommend using Visual Studio Code with the following extensions:

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin (Volar)
- Docker
- GitLens
- GitHub Copilot

A workspace configuration file is provided in `.vscode/settings.json` with recommended settings.

## Troubleshooting

### Common Issues

#### "Module not found" errors

If you encounter "Module not found" errors, try the following:

```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules
npm install
```

#### Database connection issues

If you have issues connecting to the database:

1. Make sure Supabase is running: `supabase status`
2. Check your `.env.local` file for correct database credentials
3. Try restarting Supabase: `supabase stop && supabase start`

#### Expo build issues

If you encounter issues with Expo:

```bash
# Clear Expo cache
expo r -c
```

## Continuous Integration

The project uses GitHub Actions for CI/CD. When you push to the repository or create a pull request, the CI pipeline will:

1. Lint the code
2. Run tests
3. Build the application

Make sure these checks pass before merging your changes.

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Expo Documentation](https://docs.expo.dev)
- [Supabase Documentation](https://supabase.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

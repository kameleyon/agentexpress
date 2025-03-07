# AgentExpress Server

Backend server for the AgentExpress platform, providing API endpoints for authentication, user management, and AI agent functionality.

## Technologies Used

- **Node.js & Express**: Server framework
- **Supabase**: Database and authentication
- **Prisma**: ORM for database access
- **JWT**: Authentication tokens
- **Winston & Morgan**: Logging
- **Joi**: Request validation
- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: API request throttling

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm (v9 or later)
- Supabase account and project

### Installation

1. Clone the repository
2. Navigate to the server directory:
   ```bash
   cd server
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the server directory with the following variables:
   ```
   # Supabase Credentials
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_KEY=your_supabase_service_key

   # Authentication
   JWT_SECRET=your_jwt_secret

   # Server Configuration
   PORT=3000
   NODE_ENV=development

   # Database
   DATABASE_URL=your_database_url

   # API Keys
   OPENAI_API_KEY=your_openai_api_key

   # Logging
   LOG_LEVEL=info
   ```

### Database Setup

1. Set up your Supabase project and get the connection details
2. Update the `.env` file with your Supabase credentials
3. Generate Prisma client:
   ```bash
   npx prisma generate
   ```
4. Push the schema to your database:
   ```bash
   npx prisma db push
   ```

### Running the Server

#### Development

```bash
npm run dev
```

This will start the server with nodemon, which will automatically restart when changes are detected.

#### Production

```bash
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Login and get JWT token
- `POST /api/auth/logout`: Logout user
- `GET /api/auth/me`: Get current user information

### Users

- `GET /api/users`: Get all users (admin only)
- `GET /api/users/:id`: Get user by ID
- `PUT /api/users/:id`: Update user
- `DELETE /api/users/:id`: Delete user (admin only)

### Agents

- `GET /api/agents`: Get all public agents
- `GET /api/agents/my`: Get user's agents
- `GET /api/agents/:id`: Get agent by ID
- `POST /api/agents`: Create a new agent
- `PUT /api/agents/:id`: Update agent
- `DELETE /api/agents/:id`: Delete agent

## Project Structure

```
server/
├── prisma/                # Prisma schema and migrations
├── src/
│   ├── api/
│   │   └── routes/        # API route handlers
│   ├── config/            # Configuration
│   ├── middleware/        # Express middleware
│   ├── models/            # Data models
│   ├── services/          # Business logic
│   └── utils/             # Utility functions
├── .env                   # Environment variables
├── package.json           # Dependencies and scripts
└── README.md              # Documentation
```

## Development

### Code Style

The project uses ESLint and Prettier for code formatting. You can run the linter with:

```bash
npm run lint
```

And format the code with:

```bash
npm run format
```

### Testing

Run tests with:

```bash
npm test
```

## Deployment

The server can be deployed to any Node.js hosting platform such as:

- Render
- Heroku
- AWS Elastic Beanstalk
- Google Cloud Run
- Azure App Service

Make sure to set all the required environment variables in your deployment environment.

## License

This project is proprietary and confidential.

# AgentExpress Database Schema

## Overview

AgentExpress uses Supabase (PostgreSQL) as its primary database. This document outlines the database schema, including tables, relationships, and key fields.

## Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    Users    │       │    Agents   │       │   AgentLogs │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id          │       │ id          │       │ id          │
│ email       │       │ name        │       │ agent_id    │
│ password    │       │ description │       │ user_id     │
│ first_name  │       │ type        │       │ timestamp   │
│ last_name   │       │ created_at  │       │ input       │
│ created_at  │       │ updated_at  │       │ output      │
│ updated_at  │       │ creator_id  │◄──────┤ metadata    │
└──────┬──────┘       └──────┬──────┘       └─────────────┘
       │                     │
       │                     │
       │                     │
       │               ┌─────▼─────┐       ┌─────────────┐
       │               │ UserAgents│       │Subscriptions│
       └───────────────┤           │       ├─────────────┤
                       │ id        │       │ id          │
                       │ user_id   │       │ user_id     │
                       │ agent_id  │       │ plan_id     │
                       │ settings  │◄──────┤ status      │
                       │ created_at│       │ start_date  │
                       │ updated_at│       │ end_date    │
                       └─────┬─────┘       │ created_at  │
                             │             │ updated_at  │
                             │             └─────────────┘
                             │
                       ┌─────▼─────┐       ┌─────────────┐
                       │ Integrations      │   Plans     │
                       ├─────────────┤     ├─────────────┤
                       │ id          │     │ id          │
                       │ user_agent_id     │ name        │
                       │ type        │     │ description │
                       │ credentials │     │ price       │
                       │ settings    │     │ features    │
                       │ created_at  │     │ created_at  │
                       │ updated_at  │     │ updated_at  │
                       └─────────────┘     └─────────────┘
```

## Tables

### Users

Stores user account information.

| Column      | Type         | Description                      |
|-------------|--------------|----------------------------------|
| id          | UUID         | Primary key                      |
| email       | VARCHAR(255) | User's email address (unique)    |
| password    | VARCHAR(255) | Hashed password                  |
| first_name  | VARCHAR(100) | User's first name                |
| last_name   | VARCHAR(100) | User's last name                 |
| avatar_url  | VARCHAR(255) | URL to user's profile picture    |
| role        | VARCHAR(50)  | User role (user, admin)          |
| created_at  | TIMESTAMP    | When the user was created        |
| updated_at  | TIMESTAMP    | When the user was last updated   |

### Agents

Stores information about available AI agents.

| Column      | Type         | Description                      |
|-------------|--------------|----------------------------------|
| id          | UUID         | Primary key                      |
| name        | VARCHAR(100) | Agent name                       |
| description | TEXT         | Agent description                |
| type        | VARCHAR(50)  | Agent type (social, customer, etc.) |
| capabilities| JSONB        | Agent capabilities               |
| is_public   | BOOLEAN      | Whether agent is publicly available |
| creator_id  | UUID         | Foreign key to Users             |
| created_at  | TIMESTAMP    | When the agent was created       |
| updated_at  | TIMESTAMP    | When the agent was last updated  |

### UserAgents

Links users to their configured agents.

| Column      | Type         | Description                      |
|-------------|--------------|----------------------------------|
| id          | UUID         | Primary key                      |
| user_id     | UUID         | Foreign key to Users             |
| agent_id    | UUID         | Foreign key to Agents            |
| settings    | JSONB        | User-specific agent settings     |
| is_active   | BOOLEAN      | Whether the agent is active      |
| created_at  | TIMESTAMP    | When the record was created      |
| updated_at  | TIMESTAMP    | When the record was last updated |

### AgentLogs

Stores logs of agent interactions.

| Column      | Type         | Description                      |
|-------------|--------------|----------------------------------|
| id          | UUID         | Primary key                      |
| agent_id    | UUID         | Foreign key to Agents            |
| user_id     | UUID         | Foreign key to Users             |
| timestamp   | TIMESTAMP    | When the interaction occurred    |
| input       | TEXT         | User input                       |
| output      | TEXT         | Agent output                     |
| metadata    | JSONB        | Additional metadata              |

### Subscriptions

Stores user subscription information.

| Column      | Type         | Description                      |
|-------------|--------------|----------------------------------|
| id          | UUID         | Primary key                      |
| user_id     | UUID         | Foreign key to Users             |
| plan_id     | UUID         | Foreign key to Plans             |
| status      | VARCHAR(50)  | Subscription status              |
| start_date  | TIMESTAMP    | When the subscription started    |
| end_date    | TIMESTAMP    | When the subscription ends       |
| created_at  | TIMESTAMP    | When the record was created      |
| updated_at  | TIMESTAMP    | When the record was last updated |

### Plans

Stores subscription plan information.

| Column      | Type         | Description                      |
|-------------|--------------|----------------------------------|
| id          | UUID         | Primary key                      |
| name        | VARCHAR(100) | Plan name                        |
| description | TEXT         | Plan description                 |
| price       | DECIMAL      | Plan price                       |
| features    | JSONB        | Features included in the plan    |
| created_at  | TIMESTAMP    | When the plan was created        |
| updated_at  | TIMESTAMP    | When the plan was last updated   |

### Integrations

Stores integration information for user agents.

| Column        | Type         | Description                      |
|---------------|--------------|----------------------------------|
| id            | UUID         | Primary key                      |
| user_agent_id | UUID         | Foreign key to UserAgents        |
| type          | VARCHAR(50)  | Integration type                 |
| credentials   | JSONB        | Encrypted integration credentials|
| settings      | JSONB        | Integration settings             |
| created_at    | TIMESTAMP    | When the integration was created |
| updated_at    | TIMESTAMP    | When the integration was updated |

## Indexes

- Users: email (unique)
- UserAgents: user_id, agent_id
- AgentLogs: user_id, agent_id, timestamp
- Subscriptions: user_id, status
- Integrations: user_agent_id, type

## Relationships

- Users to UserAgents: One-to-Many
- Agents to UserAgents: One-to-Many
- Users to Subscriptions: One-to-Many
- Plans to Subscriptions: One-to-Many
- UserAgents to Integrations: One-to-Many
- Users to AgentLogs: One-to-Many
- Agents to AgentLogs: One-to-Many

## Data Security

- User passwords are hashed and never stored in plain text
- Integration credentials are encrypted
- Row-level security policies control access to data
- Database backups are encrypted

## Migration Strategy

- Use Prisma migrations for version control of schema changes
- Apply migrations automatically during deployment
- Include rollback procedures for failed migrations

## Performance Considerations

- Implement appropriate indexes for frequently queried fields
- Use connection pooling for efficient database connections
- Implement query optimization for complex queries
- Consider partitioning for large tables (e.g., AgentLogs)

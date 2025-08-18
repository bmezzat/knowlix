# Knowlix task

## Tech Stack
- **Frontend:** React / Next.js / etc.
- **Backend:** Node.js + Express + TypeScript
- **Authentication:** AWS Cognito
- **Database:** SQLite (for local/testing), switchable to PostgreSQL/MySQL in production

## Project Structure

```markdown
my-project/
├── backend/    # API server (see backend/README.md)
└── frontend/   # Client app (see frontend/README.md)
```


## Getting Started
- Each folder has its own README with detailed setup instructions:
  - [backend README](backend/README.md)
  - [frontend README](frontend/README.md)

## Notes
- The project uses `.env.example` files in both backend and frontend. Copy and fill them with your environment variables.
- The backend currently uses SQLite for testing; switch to a production-ready DB for deployment.

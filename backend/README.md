## Tech Choices

### Backend
- **Node.js + Express + TypeScript**
- **jose** to validate **AWS Cognito** JWTs from JWKS
- **Stateless auth**: backend only verifies access tokens; the **frontend refreshes tokens** and retries on 401.


## Authentication (AWS Cognito)

- The frontend performs sign-in with Cognito (Hosted UI or SDK).
- Access token is sent in `Authorization: Bearer <token>` header.
- Backend **does not** refresh tokens; it simply validates JWTs with Cognito JWKS. As Frontend refresh the token

## Backend

**Base URL:** `http://localhost:3001/api`

**Protected Endpoints:**
- `GET /user/preferences` – Get user preferences
- `POST /user/preferences` – Save user preferences
- `GET /searches/history` – Get user's search history
- `POST /searches` – Save a search query
- `DELETE /searches/:id` – Delete a saved search

### Run backend

```bash
cd backend
cp .env.example .env  # fill Cognito values
yarn install
yarn run dev
```


### Run Test

```bash
yarn run test
```

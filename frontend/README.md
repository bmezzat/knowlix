# Frontend

## Tech Choices
- **React + Vite + TypeScript**
- **Redux Toolkit** → global state management
- **React Query** → data fetching, caching, and optimistic updates
- **AWS Cognito** → authentication & multi-factor auth (Authenticator app)
- **WebSockets** → real-time communication with backend
- **Cypress** → end-to-end testing
- **Vitest** → unit/integration testing
- **Material UI (MUI)** → component library with custom theme

---

## Authentication (AWS Cognito)
- Authentication is handled via **AWS Cognito Hosted UI** (not custom React forms).
- **Access & ID tokens** are stored locally and refreshed automatically when expired.
- **Multi-factor authentication (MFA)** is enabled using the Authenticator app.
- On **logout**, all Redux state and user info are cleared.
- User attributes (e.g. `name`) are retrieved via Cognito and exposed in `useAuth`, so they can be used across the app (e.g. showing initials in Avatar).

### Configuration Steps

1. Create a **Cognito User Pool** in AWS.  
2. Enable a **Cognito Domain** for the user pool.  
3. Create a **Client App** in Cognito:
   - Enable **Authorization Code Grant** flow.  
   - Enable **openid, email, profile** scopes.  
   - Add **redirect URIs** (e.g. `http://localhost:5176` for local dev (I am using port 5176 as i was having other stuiff running on 5173)).  
4. Enable **Multi-Factor Authentication (MFA)** using the Authenticator app.  
5. Update `.env` with:
   ```bash
   VITE_COGNITO_DOMAIN=<your-cognito-domain>
   VITE_COGNITO_CLIENT_ID=<your-client-id>
   VITE_COGNITO_REDIRECT_URI=http://localhost:5176
   ```
6. On login, tokens are stored locally.
7. On expiration, the **refresh token** is used to obtain a new access token
8. On logout, Redux state and user info are cleared.

---

## Main Setup (`main.tsx`)
- **Protected routes** → if a user is not authenticated, they are redirected to the **login page**. Only public routes are accessible without login.
- A **global theme** is configured for consistent styling across the app.
- **Loading component** → shown during authentication bootstrap (e.g. when tokens are being validated/restored).

---

## Features

### Chat & Messages
- All messages are **persisted in DB** before calling any API (public or private).  
  → This means chat history survives logout/login or app restarts.  
- **Clear Chat** type clear to clear the current chat session but **does not clear DB history**.

### WebSockets
Implemented with 4 event types:
- **chat_command** → (frontend → backend) user command
- **command_status** → (backend → frontend) shows command state (`success | error | processing`)
- **api_response** → (backend → frontend) final response
- **typing_indicator** → (backend → frontend) shows when backend is processing (`true | false`)

Each `socket.emit` is **scoped to the authenticated user** (not broadcast with `io.emit`).

### Data Management (React Query)
- **Optimistic updates** → UI updates immediately without waiting for backend.
- Automatic caching & refetching for:
  - **Search History** (`useSearchHistory`)
  - **User Preferences** (`useUserPrefs`)
- Faster perceived performance: frontend assumes success and adjusts later if needed.

### Search & Filtering
- Search input uses a **debounced hook** → reduces unnecessary filtering until the user finishes typing.
- Messages in panels:
  - Matching text is **highlighted (yellow)**
  - Scrolls automatically to the **first match** for better UX

### Redux Store
- Global state for:
  - Authentication
  - Chat messages
  - Search filtering
- Integrated with React Query and UI components.

---

## Testing

### End-to-End (Cypress)
Covers:
- Login & logout flow
- Token refresh and storage
- WebSocket connection & reconnection
- Public & private API messaging
- Switching between APIs
- Searching and filtering messages

Run Cypress:
```bash
npx cypress open   # interactive mode
npx cypress run    # headless mode
```

### Unit test (Vitest)

Run tests:
```bash
yarn run test
```

## Rin Locally

### Setup
```bash
cd frontend
yarn install
```

### Start Dev Server
```bash
yarn run dev
```

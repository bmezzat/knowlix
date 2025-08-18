import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthProvider, useAuth } from '../AuthContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import store from '../../store';
import { ProtectedRoute } from '@/App';

// Dummy component to test auth context
const TestComponent = () => {
  const { isAuthenticated, login, logout, user } = useAuth();
  return (
    <div>
      <span>Auth: {isAuthenticated ? 'Yes' : 'No'}</span>
      <button onClick={login}>Login</button>
      <button onClick={logout}>Logout</button>
      <div>User: {user?.email || 'No User'}</div>
    </div>
  );
};

// Dummy protected route component
const ProtectedDummy = () => <div>Protected Content</div>;

describe('AuthContext + ProtectedRoute', () => {
  let originalHref: string;

  beforeEach(() => {
    localStorage.clear();
    originalHref = window.location.href;
    // Mock window.location.href
    delete (window as any).location;
    (window as any).location = { href: '' };
  });

  afterEach(() => {
    window.location.href = originalHref;
  });

  it('starts as not authenticated', () => {
    render(
      <Provider store={store}>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </Provider>
    );

    expect(screen.getByText(/Auth: No/i)).toBeInTheDocument();
    expect(screen.getByText(/No User/i)).toBeInTheDocument();
  });

  it('logout clears tokens and redirects', async () => {
    localStorage.setItem('idToken', 'fake-id-token');
    localStorage.setItem('accessToken', 'fake-access-token');

    render(
      <Provider store={store}>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </Provider>
    );

    userEvent.click(screen.getByText('Logout'));

    await waitFor(() => {
      expect(localStorage.getItem('idToken')).toBeNull();
      expect(localStorage.getItem('accessToken')).toBeNull();
      expect(window.location.href).toContain('logout');
    });
  });

  it('loads user from stored token', async () => {
    // Fake JWT payload
    const fakePayload = btoa(JSON.stringify({ email: 'test@example.com', exp: Date.now() / 1000 + 3600 }));
    const fakeToken = `header.${fakePayload}.signature`;

    localStorage.setItem('idToken', fakeToken);
    localStorage.setItem('accessToken', 'fake-access-token');

    render(
      <Provider store={store}>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Auth: Yes/i)).toBeInTheDocument();
      expect(screen.getByText(/test@example.com/i)).toBeInTheDocument();
    });
  });
});

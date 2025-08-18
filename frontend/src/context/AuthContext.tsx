import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { resetState } from '@/store';

interface User {
  given_name?: string;
  family_name?: string;
  email?: string;
  [key: string]: any;
}


interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  idToken: string | null;
  accessToken: string | null;
  user: User | null;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  idToken: null,
  accessToken: null,
  user: null,
  login: () => {},
  logout: () => {},
});

const AUTHORIZATION_ENDPOINT = import.meta.env.VITE_COGNITO_AUTHORIZATION_ENDPOINT;
const CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_COGNITO_REDIRECT_URI;
const TOKEN_ENDPOINT = import.meta.env.VITE_COGNITO_TOKEN_ENDPOINT;
const COGNITO_LOGOUT_ENDPOINT = import.meta.env.VITE_COGNITO_LOGOUT_ENDPOINT;

function parseJwt(token: string): any {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join(''),
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Failed to parse JWT', e);
    return null;
  }
}

function getQueryParam(param: string): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get(param);
}


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const refreshTimer = useRef<NodeJS.Timeout | null>(null);
  const didRun = useRef(false);
  const dispatch = useDispatch();

  const saveTokens = (id_token: string, access_token: string, refresh_token?: string) => {
    localStorage.setItem('idToken', id_token);
    localStorage.setItem('accessToken', access_token);
    if (refresh_token) {
      localStorage.setItem('refreshToken', refresh_token);
    }
    setIdToken(id_token);
    setAccessToken(access_token);
    setIsAuthenticated(true);

    // Parse user info from id_token
    const userInfo = parseJwt(id_token);
    setUser(userInfo);

    // schedule to refresh token one minute before expiry
    if (userInfo?.exp) {
      const expiresIn = userInfo.exp * 1000 - Date.now() - 60_000;
      if (expiresIn > 0) {
        if (refreshTimer.current) clearTimeout(refreshTimer.current);
        refreshTimer.current = setTimeout(refreshTokens, expiresIn);
      }
    }
  };

   const logout = () => {
    if (refreshTimer.current) clearTimeout(refreshTimer.current);
    localStorage.removeItem('idToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('accessToken');
    setIdToken(null);
    setUser(null);
    setIsAuthenticated(false);

    dispatch(resetState());
    const logoutRedirectUrl = `${AUTHORIZATION_ENDPOINT}?client_id=${CLIENT_ID}&response_type=code&scope=openid+profile+email&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
    window.location.href = `${COGNITO_LOGOUT_ENDPOINT}?client_id=${CLIENT_ID}&logout_uri=${encodeURIComponent(logoutRedirectUrl)}`;
  };

  const login = () => {
    const url = `${AUTHORIZATION_ENDPOINT}?client_id=${CLIENT_ID}&response_type=code&scope=openid+profile+email&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
    window.location.href = url;
  };

  const refreshTokens = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      logout();
      return;
    }

    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: CLIENT_ID,
      refresh_token: refreshToken,
    });

    try {
      const response = await fetch(TOKEN_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
      });
      if (!response.ok) throw new Error('Failed to refresh tokens');
      const data = await response.json();
      saveTokens(data.id_token, data.access_token, data.refresh_token || refreshToken);
    } catch (err) {
      console.error('Refresh failed', err);
      logout();
    }
  };

  const exchangeCodeForToken = async (code: string) => {
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: CLIENT_ID,
      code,
      redirect_uri: REDIRECT_URI,
    });

    try {
      const response = await fetch(TOKEN_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch tokens');
      }
      const data = await response.json();
      saveTokens(data.id_token, data.access_token, data.refresh_token);
      window.history.replaceState({}, document.title, REDIRECT_URI);
    } catch (err) {
      console.error(err);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Below is just needed in dev env as am using Strictmode which trigger that twice in dev
    if (didRun.current) return;
    const code = getQueryParam('code');

    if (code) {
      exchangeCodeForToken(code);
    } else {
      const idTokenFromStorage = localStorage.getItem('idToken');
      const accessTokenFromStorage = localStorage.getItem('accessToken');
      const refreshTokenFromStorage = localStorage.getItem('refreshToken');

      if (idTokenFromStorage && accessTokenFromStorage) {
        setIdToken(idTokenFromStorage);
        setAccessToken(accessTokenFromStorage);
        setIsAuthenticated(true);
        setUser(parseJwt(idTokenFromStorage));


        const payload = parseJwt(idTokenFromStorage);
        if (payload?.exp && payload.exp * 1000 > Date.now()) {
          const expiresIn = payload.exp * 1000 - Date.now() - 60_000;
          if (expiresIn > 0) {
            refreshTimer.current = setTimeout(refreshTokens, expiresIn);
          }
        } else {
          refreshTokens();
        }
      }
      setIsLoading(false);
    }
    didRun.current = true;
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, idToken, accessToken, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

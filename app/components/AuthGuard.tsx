'use client';

import { useAuth } from '../contexts/AuthContext';
import LoginPage from './LoginPage';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, login, isLoading, error } = useAuth();

  if (!isAuthenticated) {
    return (
      <LoginPage 
        onLogin={login}
        isLoading={isLoading}
        error={error || undefined}
      />
    );
  }

  return <>{children}</>;
}
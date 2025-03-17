import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { userApi } from '@/api';
import { useUserStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function UserLogin() {
  const { setCurrentUser } = useUserStore();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Login mutation (find user by email)
  const loginMutation = useMutation({
    mutationFn: (email: string) => userApi.getByEmail(email),
    onSuccess: (response) => {
      setCurrentUser(response.data);
      setError(null);
    },
    onError: () => {
      setIsNewUser(true);
      setError('User not found. Please sign up.');
    },
  });
  
  // Signup mutation (create new user)
  const signupMutation = useMutation({
    mutationFn: (data: { email: string; name: string }) => userApi.create(data),
    onSuccess: (response) => {
      setCurrentUser(response.data);
      setError(null);
    },
    onError: () => {
      setError('Failed to create user. Please try again.');
    },
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (isNewUser) {
      if (!name.trim()) {
        setError('Name is required');
        return;
      }
      signupMutation.mutate({ email, name });
    } else {
      loginMutation.mutate(email);
    }
  };
  
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {isNewUser ? 'Create Account' : 'Login'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
          />
        </div>
        
        {isNewUser && (
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              required
            />
          </div>
        )}
        
        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}
        
        <Button
          type="submit"
          className="w-full"
          disabled={loginMutation.isPending || signupMutation.isPending}
        >
          {loginMutation.isPending || signupMutation.isPending
            ? 'Loading...'
            : isNewUser ? 'Sign Up' : 'Login'
          }
        </Button>
        
        <div className="text-center text-sm">
          {isNewUser ? (
            <button
              type="button"
              onClick={() => setIsNewUser(false)}
              className="text-blue-600 hover:underline"
            >
              Already have an account? Login
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsNewUser(true)}
              className="text-blue-600 hover:underline"
            >
              Don't have an account? Sign Up
            </button>
          )}
        </div>
      </form>
    </div>
  );
} 
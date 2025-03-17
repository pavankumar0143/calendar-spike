import { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { userApi } from '@/api';
import { useUserStore } from '@/store';
import { Button } from '@/components/ui/button';

export function GoogleCalendarConnect() {
  const { currentUser, setCurrentUser } = useUserStore();
  const [authCode, setAuthCode] = useState<string | null>(null);
  
  // Get Google Auth URL
  const { data: authUrlData } = useQuery({
    queryKey: ['googleAuthUrl'],
    queryFn: () => userApi.getGoogleAuthUrl().then(res => res.data),
    enabled: !!currentUser && !currentUser.isCalendarConnected,
  });
  
  // Connect Google Calendar mutation
  const connectMutation = useMutation({
    mutationFn: (code: string) => 
      userApi.connectGoogleCalendar(currentUser!.id, code),
    onSuccess: (response) => {
      setCurrentUser(response.data);
      setAuthCode(null);
    },
  });
  
  // Check for auth code in URL when redirected back from Google
  useEffect(() => {
    if (!currentUser || currentUser.isCalendarConnected) return;
    
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code) {
      setAuthCode(code);
      // Remove code from URL to prevent reuse
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [currentUser]);
  
  // Connect with auth code when available
  useEffect(() => {
    if (authCode && currentUser && !currentUser.isCalendarConnected) {
      connectMutation.mutate(authCode);
    }
  }, [authCode, currentUser, connectMutation]);
  
  if (!currentUser) return null;
  
  if (currentUser.isCalendarConnected) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
        <h3 className="text-green-800 font-medium">Google Calendar Connected</h3>
        <p className="text-green-700 text-sm mt-1">
          Your appointments will be synced with Google Calendar automatically.
        </p>
      </div>
    );
  }
  
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
      <h3 className="text-blue-800 font-medium">Connect Google Calendar</h3>
      <p className="text-blue-700 text-sm mt-1 mb-3">
        Connect your Google Calendar to sync appointments and check availability.
      </p>
      
      {connectMutation.isPending ? (
        <Button disabled>Connecting...</Button>
      ) : (
        <Button 
          onClick={() => {
            if (authUrlData?.authUrl) {
              window.location.href = authUrlData.authUrl;
            }
          }}
          disabled={!authUrlData?.authUrl}
        >
          Connect Google Calendar
        </Button>
      )}
    </div>
  );
} 
import { useUserStore } from './store';
import { UserLogin } from './components/auth/UserLogin';
import { WeekCalendar } from './components/calendar/WeekCalendar';
import { AppointmentForm } from './components/calendar/AppointmentForm';
import { GoogleCalendarConnect } from './components/calendar/GoogleCalendarConnect';

function App() {
  const { currentUser } = useUserStore();

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <header className="max-w-7xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Appointment Calendar</h1>
        {currentUser && (
          <p className="text-gray-600">Welcome, {currentUser.name}</p>
        )}
      </header>

      <main className="max-w-7xl mx-auto">
        {!currentUser ? (
          <UserLogin />
        ) : (
          <div className="space-y-6">
            <GoogleCalendarConnect />
            
            <div className="bg-white rounded-lg shadow-md p-4 h-[calc(100vh-250px)]">
              <WeekCalendar />
            </div>
            
            <AppointmentForm />
          </div>
        )}
      </main>
    </div>
  );
}

export default App; 
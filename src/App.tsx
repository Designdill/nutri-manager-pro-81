import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider } from "@/components/ui/sidebar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

import Index from "./pages/Index";
import Login from "./pages/Login";
import PatientsPage from "./pages/patients/PatientsPage";
import NewPatient from "./pages/patients/NewPatient";
import EditPatient from "./pages/patients/EditPatient";
import PatientDetailsPage from "./pages/patients/PatientDetailsPage";
import AppointmentsPage from "./pages/appointments/AppointmentsPage";
import MessagesPage from "./pages/messages/MessagesPage";
import FoodDatabasePage from "./pages/food-database/FoodDatabasePage";
import MealPlansPage from "./pages/meal-plans/MealPlansPage";
import ProgressPage from "./pages/progress/ProgressPage";
import PaymentsPage from "./pages/payments/PaymentsPage";
import SettingsPage from "./pages/settings/SettingsPage";
import NotificationsPage from "./pages/notifications/NotificationsPage";

import "./App.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

interface AuthContextType {
  session: Session | null;
  signOut: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  signOut: async () => {},
  isLoading: true,
});

export const useAuth = () => useContext(AuthContext);

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { session, isLoading } = useAuth();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!session) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
}

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", _event, session?.user?.id);
      setSession(session);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error signing out",
        description: "There was a problem signing out of your account",
        variant: "destructive",
      });
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={{ session, signOut, isLoading }}>
        <SidebarProvider>
          <div className="min-h-screen flex w-full">
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                  path="/"
                  element={
                    <PrivateRoute>
                      <Index />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/patients"
                  element={
                    <PrivateRoute>
                      <PatientsPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/patients/new"
                  element={
                    <PrivateRoute>
                      <NewPatient />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/patients/:patientId/edit"
                  element={
                    <PrivateRoute>
                      <EditPatient />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/patients/:patientId/details"
                  element={
                    <PrivateRoute>
                      <PatientDetailsPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/appointments"
                  element={
                    <PrivateRoute>
                      <AppointmentsPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/messages"
                  element={
                    <PrivateRoute>
                      <MessagesPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/food-database"
                  element={
                    <PrivateRoute>
                      <FoodDatabasePage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/meal-plans"
                  element={
                    <PrivateRoute>
                      <MealPlansPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/progress"
                  element={
                    <PrivateRoute>
                      <ProgressPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/payments"
                  element={
                    <PrivateRoute>
                      <PaymentsPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <PrivateRoute>
                      <SettingsPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/notifications"
                  element={
                    <PrivateRoute>
                      <NotificationsPage />
                    </PrivateRoute>
                  }
                />
              </Routes>
              <Toaster />
            </BrowserRouter>
          </div>
        </SidebarProvider>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
}

export default App;
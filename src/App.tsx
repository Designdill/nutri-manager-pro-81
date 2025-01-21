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
import QuestionnairesPage from "./pages/questionnaires/QuestionnairesPage";
import NewQuestionnairePage from "./pages/questionnaires/NewQuestionnairePage";
import { QuestionnaireResponseViewer } from "./pages/questionnaires/components/QuestionnaireResponseViewer";

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
    console.log("No session found, redirecting to login");
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
    const initializeAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error getting session:", error);
          throw error;
        }
        console.log("Initial session:", data?.session?.user?.id);
        setSession(data.session);
      } catch (error) {
        console.error("Failed to initialize auth:", error);
        toast({
          title: "Authentication Error",
          description: "There was a problem with authentication. Please try logging in again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log("Auth state changed:", event, currentSession?.user?.id);
      
      if (event === 'TOKEN_REFRESHED') {
        console.log('Token was refreshed successfully');
      }
      
      if (event === 'SIGNED_OUT') {
        // Clear any application state/cache
        queryClient.clear();
      }
      
      setSession(currentSession);
      setIsLoading(false);
    });

    return () => {
      console.log("Cleaning up auth subscriptions");
      subscription.unsubscribe();
    };
  }, [toast]);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
      
      // Clear any application state/cache
      queryClient.clear();
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
                <Route
                  path="/questionnaires"
                  element={
                    <PrivateRoute>
                      <QuestionnairesPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/questionnaires/new"
                  element={
                    <PrivateRoute>
                      <NewQuestionnairePage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/questionnaires/:id/responses"
                  element={
                    <PrivateRoute>
                      <QuestionnaireResponseViewer />
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
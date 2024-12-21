import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createClient } from "@supabase/supabase-js";
import { createContext, useContext } from "react";
import { Toaster } from "@/components/ui/toaster";

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

const queryClient = new QueryClient();

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const AuthContext = createContext<{
  session: any;
  signOut: () => void;
}>({ session: null, signOut: () => {} });

export const useAuth = () => useContext(AuthContext);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/patients" element={<PatientsPage />} />
          <Route path="/patients/new" element={<NewPatient />} />
          <Route path="/patients/:patientId/edit" element={<EditPatient />} />
          <Route path="/patients/:patientId/details" element={<PatientDetailsPage />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/food-database" element={<FoodDatabasePage />} />
          <Route path="/meal-plans" element={<MealPlansPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/payments" element={<PaymentsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card } from "@/components/ui/card";
import { Users, Calendar, ChartBar } from "lucide-react";

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <main className="flex-1 p-8">
          <SidebarTrigger />
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Welcome, Dr. Smith</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-primary-100 p-3 rounded-lg">
                    <Users className="h-6 w-6 text-primary-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Patients</p>
                    <p className="text-2xl font-semibold">248</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-primary-100 p-3 rounded-lg">
                    <Calendar className="h-6 w-6 text-primary-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Today's Appointments</p>
                    <p className="text-2xl font-semibold">8</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-primary-100 p-3 rounded-lg">
                    <ChartBar className="h-6 w-6 text-primary-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Success Rate</p>
                    <p className="text-2xl font-semibold">92%</p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Recent Patients</h2>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="w-10 h-10 bg-primary-200 rounded-full flex items-center justify-center">
                        <span className="text-primary-700 font-medium">
                          {String.fromCharCode(64 + i)}M
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">Patient {i}</p>
                        <p className="text-sm text-gray-500">Last visit: Today</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-primary-500" />
                      </div>
                      <div>
                        <p className="font-medium">Patient {i}</p>
                        <p className="text-sm text-gray-500">Today at {12 + i}:00 PM</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
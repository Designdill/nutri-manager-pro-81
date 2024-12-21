import { useState } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

interface Patient {
  id: string;
  full_name: string;
  avatar_url?: { photo_url: string }[];
}

interface ChatListProps {
  patients: Patient[];
  isLoading: boolean;
}

export function ChatList({ patients, isLoading }: ChatListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPatients = patients?.filter((patient) =>
    patient.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <Input
          placeholder="Buscar pacientes..."
          className="mb-4"
          disabled
        />
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center space-x-4 p-2">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-4">
      <Input
        placeholder="Buscar pacientes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      <ScrollArea className="h-[calc(100vh-8rem)]">
        {filteredPatients?.length === 0 ? (
          <p className="text-center text-gray-500 mt-4">
            Nenhum paciente encontrado
          </p>
        ) : (
          <div className="space-y-2">
            {filteredPatients?.map((patient) => (
              <button
                key={patient.id}
                className="w-full flex items-center space-x-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => console.log("Selected patient:", patient.id)}
              >
                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                  {patient.avatar_url?.[0]?.photo_url ? (
                    <img
                      src={patient.avatar_url[0].photo_url}
                      alt={patient.full_name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-xl text-gray-600">
                      {patient.full_name[0]}
                    </span>
                  )}
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium">{patient.full_name}</p>
                  <p className="text-sm text-gray-500">Clique para conversar</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
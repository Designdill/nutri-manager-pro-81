import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, ImageIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Photo {
  id: string;
  photo_url: string;
  photo_type: string;
  taken_at: string;
}

interface PatientPhotoGalleryProps {
  photos: Photo[];
}

export function PatientPhotoGallery({ photos }: PatientPhotoGalleryProps) {
  const photoTypeLabels: Record<string, string> = {
    front: "Frente",
    side: "Lateral",
    back: "Costas",
    other: "Outro"
  };

  const sortedPhotos = [...photos].sort(
    (a, b) => new Date(b.taken_at).getTime() - new Date(a.taken_at).getTime()
  ).slice(0, 6);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Camera className="h-5 w-5 text-primary" />
          Minha Evolução Visual
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sortedPhotos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <ImageIcon className="h-12 w-12 text-muted-foreground/50 mb-2" />
            <p className="text-muted-foreground text-sm">
              Nenhuma foto de progresso ainda
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Seu nutricionista irá registrar suas fotos durante as consultas
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {sortedPhotos.map((photo) => (
              <div 
                key={photo.id} 
                className="relative group rounded-lg overflow-hidden aspect-square"
              >
                <img
                  src={photo.photo_url}
                  alt={`Foto ${photoTypeLabels[photo.photo_type] || photo.photo_type}`}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-2 left-2 right-2 text-white text-xs">
                    <p className="font-medium">{photoTypeLabels[photo.photo_type] || photo.photo_type}</p>
                    <p className="opacity-80">
                      {format(new Date(photo.taken_at), "dd MMM yyyy", { locale: ptBR })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

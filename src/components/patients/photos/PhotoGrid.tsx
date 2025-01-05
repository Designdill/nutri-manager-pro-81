import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { format } from "date-fns";
import { PhotoRecord } from "../types";

interface PhotoGridProps {
  photos: PhotoRecord[];
  getLatestPhoto: (type: string) => PhotoRecord | undefined;
}

export function PhotoGrid({ photos, getLatestPhoto }: PhotoGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {['front', 'side', 'back'].map(type => {
        const latestPhoto = getLatestPhoto(type);
        return (
          <div key={type} className="space-y-2">
            <h3 className="font-medium capitalize">
              Foto {type === 'front' ? 'Frontal' : type === 'side' ? 'Lateral' : 'Costas'}
            </h3>
            {latestPhoto ? (
              <Dialog>
                <DialogTrigger asChild>
                  <div className="cursor-pointer">
                    <img
                      src={latestPhoto.photo_url}
                      alt={`Foto ${type}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      {format(new Date(latestPhoto.taken_at), "dd/MM/yyyy")}
                    </p>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      Foto {type === 'front' ? 'Frontal' : type === 'side' ? 'Lateral' : 'Costas'}
                    </DialogTitle>
                  </DialogHeader>
                  <img
                    src={latestPhoto.photo_url}
                    alt={`Foto ${type}`}
                    className="w-full max-h-[80vh] object-contain rounded-lg"
                  />
                </DialogContent>
              </Dialog>
            ) : (
              <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center">
                <p className="text-sm text-muted-foreground">Nenhuma foto</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
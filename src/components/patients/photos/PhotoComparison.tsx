import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { PhotoType } from "../types";

interface PhotoComparisonProps {
  photos: PhotoType[];
  photoType: 'front' | 'side' | 'back';
}

export function PhotoComparison({ photos, photoType }: PhotoComparisonProps) {
  const [beforeDate, setBeforeDate] = useState<string>("");
  const [afterDate, setAfterDate] = useState<string>("");

  const filteredPhotos = photos.filter(photo => photo.photo_type === photoType);
  const sortedDates = [...new Set(filteredPhotos.map(photo => photo.taken_at))].sort();

  const beforePhoto = filteredPhotos.find(photo => photo.taken_at === beforeDate);
  const afterPhoto = filteredPhotos.find(photo => photo.taken_at === afterDate);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Comparação de Fotos - {photoType === 'front' ? 'Frontal' : photoType === 'side' ? 'Lateral' : 'Costas'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Foto Anterior</label>
              <Select value={beforeDate} onValueChange={setBeforeDate}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a data" />
                </SelectTrigger>
                <SelectContent>
                  {sortedDates.map(date => (
                    <SelectItem key={date} value={date}>
                      {format(new Date(date), "dd/MM/yyyy")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Foto Atual</label>
              <Select value={afterDate} onValueChange={setAfterDate}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a data" />
                </SelectTrigger>
                <SelectContent>
                  {sortedDates.map(date => (
                    <SelectItem key={date} value={date}>
                      {format(new Date(date), "dd/MM/yyyy")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-square relative bg-muted rounded-lg overflow-hidden">
              {beforePhoto ? (
                <img
                  src={beforePhoto.photo_url}
                  alt="Foto anterior"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">Selecione uma foto</p>
                </div>
              )}
            </div>
            <div className="aspect-square relative bg-muted rounded-lg overflow-hidden">
              {afterPhoto ? (
                <img
                  src={afterPhoto.photo_url}
                  alt="Foto atual"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">Selecione uma foto</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
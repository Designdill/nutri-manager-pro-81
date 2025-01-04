import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Camera, Loader2 } from "lucide-react";

interface PatientPhotosProps {
  patientId: string;
}

export function PatientPhotos({ patientId }: PatientPhotosProps) {
  const [uploading, setUploading] = useState(false);
  const [photos, setPhotos] = useState<any[]>([]);
  const { toast } = useToast();

  const uploadPhoto = async (event: React.ChangeEvent<HTMLInputElement>, photoType: string) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("Você precisa selecionar uma imagem para fazer upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${patientId}/${Math.random()}.${fileExt}`;

      console.log("Uploading photo:", fileName);

      const { error: uploadError } = await supabase.storage
        .from('patient-photos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('patient-photos')
        .getPublicUrl(fileName);

      const { error: dbError } = await supabase
        .from('patient_photos')
        .insert({
          patient_id: patientId,
          photo_type: photoType,
          photo_url: publicUrl,
          taken_at: new Date().toISOString(),
        });

      if (dbError) throw dbError;

      toast({
        title: "Foto adicionada com sucesso",
      });

      fetchPhotos();
    } catch (error: any) {
      console.error("Error uploading photo:", error);
      toast({
        title: "Erro ao fazer upload da foto",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const fetchPhotos = async () => {
    try {
      console.log("Fetching photos for patient:", patientId);
      
      const { data, error } = await supabase
        .from('patient_photos')
        .select('*')
        .eq('patient_id', patientId)
        .order('taken_at', { ascending: false });

      if (error) throw error;

      console.log("Photos fetched:", data);
      setPhotos(data || []);
    } catch (error) {
      console.error("Error fetching photos:", error);
    }
  };

  useEffect(() => {
    if (patientId) {
      fetchPhotos();
    }
  }, [patientId]);

  const PhotoUploadButton = ({ photoType, label }: { photoType: string; label: string }) => (
    <div>
      <input
        type="file"
        id={`photo-${photoType}`}
        accept="image/*"
        onChange={(e) => uploadPhoto(e, photoType)}
        disabled={uploading}
        className="hidden"
      />
      <Button
        variant="outline"
        onClick={() => document.getElementById(`photo-${photoType}`)?.click()}
        disabled={uploading}
      >
        {uploading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Camera className="mr-2 h-4 w-4" />
        )}
        {label}
      </Button>
    </div>
  );

  const getLatestPhotos = (type: string) => {
    return photos.filter(photo => photo.photo_type === type)[0];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fotos do Paciente (Opcional)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <p className="text-sm text-muted-foreground">
            Você pode adicionar fotos do paciente agora ou posteriormente durante as consultas.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <PhotoUploadButton photoType="front" label="Foto Frontal" />
            <PhotoUploadButton photoType="side" label="Foto Lateral" />
            <PhotoUploadButton photoType="back" label="Foto Costas" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['front', 'side', 'back'].map(type => {
              const latestPhoto = getLatestPhotos(type);
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
        </div>
      </CardContent>
    </Card>
  );
}
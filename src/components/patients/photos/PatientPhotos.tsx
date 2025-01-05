import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PhotoComparison } from "./PhotoComparison";
import { PhotoGrid } from "./PhotoGrid";
import { PhotoUploadButton } from "./PhotoUploadButton";
import { PhotoRecord } from "../types";

interface PatientPhotosProps {
  patientId: string;
  showComparison?: boolean;
}

export function PatientPhotos({ patientId, showComparison = false }: PatientPhotosProps) {
  const [uploading, setUploading] = useState(false);
  const [photos, setPhotos] = useState<PhotoRecord[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchPhotos();
  }, [patientId]);

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
      setPhotos(data as PhotoRecord[]);
    } catch (error) {
      console.error("Error fetching photos:", error);
    }
  };

  const getLatestPhoto = (type: string) => {
    return photos.find(photo => photo.photo_type === type);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Fotos do Paciente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
              Você pode adicionar fotos do paciente agora ou posteriormente durante as consultas.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <PhotoUploadButton 
                photoType="front" 
                label="Foto Frontal" 
                uploading={uploading} 
                onUpload={(e) => uploadPhoto(e, "front")} 
              />
              <PhotoUploadButton 
                photoType="side" 
                label="Foto Lateral" 
                uploading={uploading} 
                onUpload={(e) => uploadPhoto(e, "side")} 
              />
              <PhotoUploadButton 
                photoType="back" 
                label="Foto Costas" 
                uploading={uploading} 
                onUpload={(e) => uploadPhoto(e, "back")} 
              />
            </div>

            <PhotoGrid photos={photos} getLatestPhoto={getLatestPhoto} />
          </div>
        </CardContent>
      </Card>

      {showComparison && photos.length > 0 && (
        <div className="space-y-6">
          <PhotoComparison photos={photos} photoType="front" />
          <PhotoComparison photos={photos} photoType="side" />
          <PhotoComparison photos={photos} photoType="back" />
        </div>
      )}
    </div>
  );
}
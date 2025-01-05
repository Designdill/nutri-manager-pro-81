import { Button } from "@/components/ui/button";
import { Camera, Loader2 } from "lucide-react";

interface PhotoUploadButtonProps {
  photoType: string;
  label: string;
  uploading: boolean;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function PhotoUploadButton({ photoType, label, uploading, onUpload }: PhotoUploadButtonProps) {
  return (
    <div>
      <input
        type="file"
        id={`photo-${photoType}`}
        accept="image/*"
        onChange={onUpload}
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
}
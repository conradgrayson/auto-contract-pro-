
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface ImageUploadProps {
  label: string;
  currentImageUrl?: string;
  onImageUploaded: (url: string, fileName: string) => void;
  onImageRemoved: () => void;
  folder: string; // 'clients' ou 'chauffeurs'
  accept?: string;
}

const ImageUpload = ({ 
  label, 
  currentImageUrl, 
  onImageUploaded, 
  onImageRemoved,
  folder,
  accept = "image/*"
}: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      onImageUploaded(data.publicUrl, fileName);
      
      toast({
        title: "Image uploadée",
        description: "L'image a été uploadée avec succès.",
      });
    } catch (error) {
      console.error('Erreur upload:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'uploader l'image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = async () => {
    if (currentImageUrl) {
      try {
        // Extraire le nom du fichier de l'URL
        const urlParts = currentImageUrl.split('/');
        const fileName = urlParts[urlParts.length - 1];
        const filePath = `${folder}/${fileName}`;
        
        await supabase.storage
          .from('documents')
          .remove([filePath]);
        
        onImageRemoved();
        
        toast({
          title: "Image supprimée",
          description: "L'image a été supprimée avec succès.",
        });
      } catch (error) {
        console.error('Erreur suppression:', error);
        toast({
          title: "Erreur",
          description: "Impossible de supprimer l'image",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      
      {currentImageUrl ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => window.open(currentImageUrl, '_blank')}
            >
              <Eye className="h-4 w-4 mr-1" />
              Voir l'image
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={removeImage}
              className="text-red-600 hover:text-red-700"
            >
              <X className="h-4 w-4 mr-1" />
              Supprimer
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Input
            type="file"
            accept={accept}
            onChange={uploadImage}
            disabled={uploading}
            className="flex-1"
          />
          <Button
            type="button"
            disabled={uploading}
            size="sm"
            variant="outline"
          >
            <Upload className="h-4 w-4 mr-1" />
            {uploading ? 'Upload...' : 'Upload'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;

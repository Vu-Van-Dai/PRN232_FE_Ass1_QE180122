import { Upload, X } from "lucide-react";
import { useState } from "react";

interface UploadedImage {
  id: string;
  url: string;
  isCover?: boolean;
  isUploading?: boolean;
  progress?: number;
}

const ImageUpload = () => {
  const [images, setImages] = useState<UploadedImage[]>([
    {
      id: "1",
      url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200",
      isCover: true,
    },
    {
      id: "2",
      url: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=200",
    },
    {
      id: "3",
      url: "",
      isUploading: true,
      progress: 65,
    },
  ]);

  const removeImage = (id: string) => {
    setImages(images.filter((img) => img.id !== id));
  };

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <div className="border-2 border-dashed border-primary/30 rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer bg-primary/5">
        <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Upload className="w-6 h-6 text-primary" />
        </div>
        <p className="text-sm">
          <span className="text-primary font-medium">Click to upload</span>
          <span className="text-muted-foreground"> or drag and drop</span>
        </p>
        <p className="text-xs text-primary mt-1">PNG, JPG up to 10MB</p>
      </div>

      {/* Uploaded Images */}
      <div className="flex gap-3 flex-wrap">
        {images.map((image) => (
          <div
            key={image.id}
            className="relative w-32 h-32 rounded-xl overflow-hidden border border-border bg-muted/30"
          >
            {image.isUploading ? (
              <div className="w-full h-full flex flex-col items-center justify-center p-3">
                <div className="w-full bg-muted rounded-full h-1.5 mb-2">
                  <div
                    className="bg-primary h-1.5 rounded-full transition-all"
                    style={{ width: `${image.progress}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">Uploading...</span>
              </div>
            ) : (
              <>
                <img
                  src={image.url}
                  alt="Product"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => removeImage(image.id)}
                  className="absolute top-1.5 right-1.5 w-6 h-6 bg-foreground/80 text-background rounded-full flex items-center justify-center hover:bg-foreground transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
                {image.isCover && (
                  <span className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-foreground/80 text-background text-xs px-2 py-0.5 rounded">
                    Cover
                  </span>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUpload;

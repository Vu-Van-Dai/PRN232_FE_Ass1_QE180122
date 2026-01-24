import { Upload, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  addProductImageUrls,
  deleteProductImage,
  setCoverProductImage,
  uploadProductImages,
  type ProductImageItem,
} from "@/api/productImages";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  productId?: number;
  existingImages?: ProductImageItem[];
  deferred?: boolean;
  onFilesSelected?: (files: File[]) => void;
  onUrlsSelected?: (urls: string[]) => void;
};

type PendingImage = {
  id: string;
  file: File;
  previewUrl: string;
};

const ImageUpload = ({ productId, existingImages, deferred, onFilesSelected }: Props) => {
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [pending, setPending] = useState<PendingImage[]>([]);
  const [pendingUrls, setPendingUrls] = useState<string[]>([]);
  const [urlInput, setUrlInput] = useState("");
  const pendingRef = useRef<PendingImage[]>([]);

  useEffect(() => {
    pendingRef.current = pending;
  }, [pending]);

  const images = useMemo(() => {
    const apiImages = (existingImages ?? []).map((i) => ({
      key: `api-${i.id}`,
      id: i.id,
      url: i.url,
      isCover: i.isCover,
      source: "api" as const,
    }));

    const pendingImages = pending.map((p) => ({
      key: `pending-${p.id}`,
      id: p.id,
      url: p.previewUrl,
      isCover: false,
      source: "pending" as const,
    }));

    return [...apiImages, ...pendingImages];
  }, [existingImages, pending]);

  // cleanup object urls on unmount
  useEffect(() => {
    return () => {
      for (const p of pendingRef.current) URL.revokeObjectURL(p.previewUrl);
    };
  }, []);

  const makeId = () => {
    const c = (globalThis as unknown as { crypto?: Crypto }).crypto;
    if (c && typeof c.randomUUID === "function") return c.randomUUID();
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  };

  const openPicker = () => inputRef.current?.click();

  const syncToParent = (nextPending: PendingImage[]) => {
    onFilesSelected?.(nextPending.map((p) => p.file));
  };

  const syncUrlsToParent = (urls: string[]) => {
    onUrlsSelected?.(urls);
  };

  const addFiles = (files: File[]) => {
    const picked: PendingImage[] = [];
    for (const f of files) {
      if (f.size > 10 * 1024 * 1024) {
        toast.error(`File too large (max 10MB): ${f.name}`);
        continue;
      }
      if (!f.type.startsWith("image/")) {
        toast.error(`Only images are supported: ${f.name}`);
        continue;
      }
      picked.push({
        id: makeId(),
        file: f,
        previewUrl: URL.createObjectURL(f),
      });
    }

    if (picked.length === 0) return;
    setPending((prev) => {
      const next = [...prev, ...picked];
      syncToParent(next);
      return next;
    });
  };

  const removePending = (id: string) => {
    setPending((prev) => {
      const next = prev.filter((p) => p.id !== id);
      const removed = prev.find((p) => p.id === id);
      if (removed) URL.revokeObjectURL(removed.previewUrl);
      syncToParent(next);
      return next;
    });
  };

  const addUrl = () => {
    const raw = urlInput.trim();
    if (!raw) return;
    try {
      const u = new URL(raw);
      if (u.protocol !== "http:" && u.protocol !== "https:") {
        toast.error("Only http/https URLs are supported");
        return;
      }
    } catch {
      toast.error("Invalid URL");
      return;
    }

    setPendingUrls((prev) => {
      const next = [...prev, raw];
      syncUrlsToParent(next);
      return next;
    });
    setUrlInput("");
  };

  const removeUrl = (index: number) => {
    setPendingUrls((prev) => {
      const next = prev.filter((_, i) => i !== index);
      syncUrlsToParent(next);
      return next;
    });
  };

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!productId) throw new Error("Missing productId");
      if (pending.length === 0) throw new Error("Please select image files");
      return uploadProductImages(
        productId,
        pending.map((p) => p.file),
      );
    },
    onSuccess: async () => {
      toast.success("Images uploaded successfully");
      setPending((prev) => {
        for (const p of prev) URL.revokeObjectURL(p.previewUrl);
        return [];
      });
      syncToParent([]);
      await queryClient.invalidateQueries({ queryKey: ["product", productId] });
      await queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      await queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : "Failed to upload images");
    },
  });

  const addUrlsMutation = useMutation({
    mutationFn: async () => {
      if (!productId) throw new Error("Missing productId");
      if (pendingUrls.length === 0) throw new Error("Please enter image URLs");
      return addProductImageUrls(productId, pendingUrls);
    },
    onSuccess: async () => {
      toast.success("Image URLs added successfully");
      setPendingUrls([]);
      syncUrlsToParent([]);
      await queryClient.invalidateQueries({ queryKey: ["product", productId] });
      await queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      await queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : "Failed to add URLs");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (imageId: number) => {
      if (!productId) throw new Error("Missing productId");
      return deleteProductImage(productId, imageId);
    },
    onSuccess: async () => {
      toast.success("Image deleted");
      await queryClient.invalidateQueries({ queryKey: ["product", productId] });
      await queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      await queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : "Failed to delete image");
    },
  });

  const coverMutation = useMutation({
    mutationFn: async (imageId: number) => {
      if (!productId) throw new Error("Missing productId");
      return setCoverProductImage(productId, imageId);
    },
    onSuccess: async () => {
      toast.success("Cover updated");
      await queryClient.invalidateQueries({ queryKey: ["product", productId] });
      await queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      await queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : "Failed to set cover");
    },
  });

  const canUploadNow = Boolean(productId) && !deferred;

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          if (!files.length) return;
          addFiles(files);
          // allow picking same file again
          if (inputRef.current) inputRef.current.value = "";
        }}
      />

      <div
        className="border-2 border-dashed border-primary/30 rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer bg-primary/5"
        role="button"
        tabIndex={0}
        onClick={openPicker}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") openPicker();
        }}
      >
        <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Upload className="w-6 h-6 text-primary" />
        </div>
        <p className="text-sm">
          <span className="text-primary font-medium">Click to upload</span>
          <span className="text-muted-foreground"> or drag and drop</span>
        </p>
        <p className="text-xs text-primary mt-1">PNG, JPG up to 10MB</p>
      </div>

      {/* Add by URL */}
      <div className="flex items-center gap-2">
        <Input
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="input-admin"
        />
        <Button type="button" variant="outline" onClick={addUrl}>
          Add URL
        </Button>
      </div>

      {pendingUrls.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">{pendingUrls.length} pending URL(s)</div>
          <div className="space-y-1">
            {pendingUrls.map((u, idx) => (
              <div key={`${u}-${idx}`} className="flex items-center justify-between gap-2">
                <div className="text-xs text-muted-foreground truncate flex-1">{u}</div>
                <Button type="button" variant="ghost" size="sm" onClick={() => removeUrl(idx)}>
                  Remove
                </Button>
              </div>
            ))}
          </div>
          {canUploadNow ? (
            <Button
              type="button"
              onClick={() => addUrlsMutation.mutate()}
              disabled={addUrlsMutation.isPending}
            >
              {addUrlsMutation.isPending ? "Saving..." : "Save URL images"}
            </Button>
          ) : (
            <div className="text-xs text-muted-foreground">URL images will be saved when you save.</div>
          )}
        </div>
      )}

      {/* Images grid */}
      {images.length > 0 && (
        <div className="flex gap-3 flex-wrap">
          {images.map((img) => (
            <div
              key={img.key}
              className="relative w-32 h-32 rounded-xl overflow-hidden border border-border bg-muted/30"
            >
              <img src={img.url} alt="Product" className="w-full h-full object-cover" />

              {img.source === "pending" ? (
                <button
                  type="button"
                  onClick={() => removePending(img.id)}
                  className="absolute top-1.5 right-1.5 w-6 h-6 bg-foreground/80 text-background rounded-full flex items-center justify-center hover:bg-foreground transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              ) : (
                <div className="absolute top-1.5 right-1.5 flex gap-1">
                  <button
                    type="button"
                    onClick={() => deleteMutation.mutate(img.id)}
                    className="w-6 h-6 bg-foreground/80 text-background rounded-full flex items-center justify-center hover:bg-foreground transition-colors"
                    disabled={deleteMutation.isPending}
                    title="Delete"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}

              {img.isCover && (
                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-foreground/80 text-background text-xs px-2 py-0.5 rounded">
                  Cover
                </span>
              )}

              {img.source === "api" && !img.isCover && (
                <button
                  type="button"
                  onClick={() => coverMutation.mutate(img.id)}
                  className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-background/80 text-foreground text-xs px-2 py-0.5 rounded border border-border hover:bg-background"
                  disabled={coverMutation.isPending}
                  title="Set as cover"
                >
                  Set cover
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {pending.length > 0 && (
        <div className="flex items-center justify-between gap-3">
          <div className="text-xs text-muted-foreground">
            {pending.length} pending image(s)
          </div>
          {canUploadNow ? (
            <Button
              type="button"
              className="gap-2"
              onClick={() => uploadMutation.mutate()}
              disabled={uploadMutation.isPending}
            >
              {uploadMutation.isPending ? "Uploading..." : "Upload selected"}
            </Button>
          ) : (
            <div className="text-xs text-muted-foreground">Images will be uploaded when you save.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;

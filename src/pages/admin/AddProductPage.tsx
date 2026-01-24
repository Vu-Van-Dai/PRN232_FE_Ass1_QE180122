import { ArrowRight, Eye, List, Image } from "lucide-react";
import { Link } from "react-router-dom";
import AdminHeader from "@/components/layout/AdminHeader";
import ImageUpload from "@/components/products/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const AddProductPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />

      <main className="p-6 max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Link to="/admin/products" className="text-primary hover:underline">
            Products
          </Link>
          <span>›</span>
          <span className="text-primary">New Product</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Add New Product</h1>
            <p className="text-muted-foreground mt-1">
              Fill in the details below to create a new product listing.
            </p>
          </div>
          <Button variant="outline" className="gap-2">
            <Eye className="w-4 h-4" />
            Preview
          </Button>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* General Information */}
          <div className="card-admin p-6">
            <div className="flex items-center gap-2 mb-6">
              <List className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">General Information</h2>
            </div>

            <div className="space-y-5">
              <div>
                <Label className="text-foreground">
                  Product Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  placeholder="e.g., Wireless Noise-Cancelling Headphones"
                  className="mt-2 input-admin"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <Label className="text-foreground">
                    Price <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative mt-2">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary">$</span>
                    <Input
                      placeholder="0.00"
                      className="pl-7 input-admin"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-foreground">Stock Quantity</Label>
                  <Input
                    placeholder="e.g., 100"
                    className="mt-2 input-admin"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <Label className="text-foreground">Description</Label>
                  <span className="text-xs text-primary">Markdown supported</span>
                </div>
                <Textarea
                  placeholder="Describe the product features, specifications, and benefits..."
                  className="mt-2 min-h-[160px] input-admin resize-y"
                />
              </div>
            </div>
          </div>

          {/* Product Media */}
          <div className="card-admin p-6">
            <div className="flex items-center gap-2 mb-6">
              <Image className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Product Media</h2>
            </div>

            <ImageUpload />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Link to="/admin/products">
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button className="gap-2">
              Save Product
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-sm text-muted-foreground py-8">
          © 2024 Admin Console. All rights reserved.
        </footer>
      </main>
    </div>
  );
};

export default AddProductPage;

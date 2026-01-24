import { useState } from "react";
import { Plus, Search, SlidersHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import AdminHeader from "@/components/layout/AdminHeader";
import ProductTable from "@/components/products/ProductTable";
import DeleteConfirmModal from "@/components/products/DeleteConfirmModal";
import AdminPagination from "@/components/admin/AdminPagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const ProductsPage = () => {
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; productName: string }>({
    open: false,
    productName: "",
  });
  const [currentPage, setCurrentPage] = useState(1);

  const handleDelete = (id: string) => {
    setDeleteModal({ open: true, productName: "Wireless Headphones X2" });
  };

  const confirmDelete = () => {
    toast.success("Product deleted successfully!");
    setDeleteModal({ open: false, productName: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader showSearch />

      <main className="p-6 max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Link to="/admin" className="hover:text-primary transition-colors">
            Dashboard
          </Link>
          <span>/</span>
          <span className="text-foreground">Products</span>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Manage Products</h1>
            <p className="text-muted-foreground mt-1">
              View, search, and manage your store inventory effectively.
            </p>
          </div>
          <Link to="/admin/products/new">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add New Product
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="card-admin p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, SKU, or ID..."
                className="pl-10 input-admin"
              />
            </div>
            <div className="flex gap-3">
              <Select defaultValue="all">
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="apparel">Apparel</SelectItem>
                  <SelectItem value="home">Home & Garden</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Stock Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Stock Status</SelectItem>
                  <SelectItem value="in">In Stock</SelectItem>
                  <SelectItem value="low">Low Stock</SelectItem>
                  <SelectItem value="out">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <SlidersHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Table */}
        <ProductTable onDelete={handleDelete} />

        {/* Pagination */}
        <AdminPagination
          currentPage={currentPage}
          totalPages={50}
          onPageChange={setCurrentPage}
          totalItems={248}
          itemsPerPage={5}
        />

        {/* Delete Modal */}
        <DeleteConfirmModal
          isOpen={deleteModal.open}
          onClose={() => setDeleteModal({ open: false, productName: "" })}
          onConfirm={confirmDelete}
          productName={deleteModal.productName}
        />
      </main>
    </div>
  );
};

export default ProductsPage;

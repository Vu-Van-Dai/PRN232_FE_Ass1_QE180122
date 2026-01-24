import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Link } from "react-router-dom";
import AdminHeader from "@/components/layout/AdminHeader";
import ProductTable from "@/components/products/ProductTable";
import DeleteConfirmModal from "@/components/products/DeleteConfirmModal";
import AdminPagination from "@/components/admin/AdminPagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteProduct, getProducts } from "@/api/products";

const ProductsPage = () => {
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; productName: string }>({
    open: false,
    productName: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  const queryClient = useQueryClient();

  const productsQuery = useQuery({
    queryKey: ["admin-products", { search }],
    queryFn: () => getProducts({ search: search.trim() || undefined }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success("Product deleted successfully!");
    },
    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : "Failed to delete product");
    },
  });

  const handleDelete = (id: number, name: string) => {
    setSelectedProductId(id);
    setDeleteModal({ open: true, productName: name });
  };

  const confirmDelete = () => {
    if (selectedProductId === null) return;
    deleteMutation.mutate(selectedProductId);
    setDeleteModal({ open: false, productName: "" });
    setSelectedProductId(null);
  };

  const itemsPerPage = 10;
  const products = productsQuery.data ?? [];
  const totalPages = Math.max(1, Math.ceil(products.length / itemsPerPage));
  const pagedProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />

      <main className="p-6 max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Link to="/admin" className="hover:text-primary transition-colors">
          </Link>
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
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
        </div>

        {/* Table */}
        {productsQuery.isLoading && (
          <div className="text-sm text-muted-foreground">Loading products...</div>
        )}
        {productsQuery.isError && (
          <div className="text-sm text-destructive">Failed to load products.</div>
        )}
        {!productsQuery.isLoading && !productsQuery.isError && (
          <ProductTable products={pagedProducts} onDelete={handleDelete} />
        )}

        {/* Pagination */}
        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(p) => setCurrentPage(Math.min(Math.max(1, p), totalPages))}
          totalItems={products.length}
          itemsPerPage={itemsPerPage}
        />

        {/* Delete Modal */}
        <DeleteConfirmModal
          isOpen={deleteModal.open}
          onClose={() => {
            setDeleteModal({ open: false, productName: "" });
            setSelectedProductId(null);
          }}
          onConfirm={confirmDelete}
          productName={deleteModal.productName}
        />
      </main>
    </div>
  );
};

export default ProductsPage;

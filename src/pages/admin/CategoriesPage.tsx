import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import AdminHeader from "@/components/layout/AdminHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createCategory, deleteCategory, getCategories } from "@/api/categories";
import { toast } from "sonner";

const CategoriesPage = () => {
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [search, setSearch] = useState("");

  const categoriesQuery = useQuery({
    queryKey: ["categories", { search }],
    queryFn: () => getCategories({ search: search.trim() || undefined }),
  });

  const createMutation = useMutation({
    mutationFn: () =>
      createCategory({
        name: name.trim(),
        description: description.trim(),
      }),
    onSuccess: async () => {
      setName("");
      setDescription("");
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category created successfully!");
    },
    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : "Failed to create category");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category deleted successfully!");
    },
    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : "Failed to delete category");
    },
  });

  const canSubmit = useMemo(() => name.trim().length > 0, [name]);

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />

      <main className="p-6 max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Link to="/admin/products" className="text-primary hover:underline">
            Products
          </Link>
          <span>›</span>
          <span className="text-primary">Category</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Manage Categories</h1>
            <p className="text-muted-foreground mt-1">Create categories to organize your products.</p>
          </div>
        </div>

        {/* Create */}
        <div className="card-admin p-6 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <Plus className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Add Category</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <Label className="text-foreground">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                className="mt-2 input-admin"
                placeholder="e.g., Clothing"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <Label className="text-foreground">Description</Label>
              <Textarea
                className="mt-2 input-admin resize-y min-h-[80px]"
                placeholder="Short description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button
              className="gap-2"
              disabled={!canSubmit || createMutation.isPending}
              onClick={() => createMutation.mutate()}
            >
              <Plus className="w-4 h-4" />
              Add
            </Button>
          </div>
        </div>

        {/* List */}
        <div className="card-admin p-4 mb-4">
          <Input
            className="input-admin"
            placeholder="Search category by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {categoriesQuery.isLoading && (
          <div className="text-sm text-muted-foreground">Loading categories...</div>
        )}
        {categoriesQuery.isError && (
          <div className="text-sm text-destructive">Failed to load categories.</div>
        )}

        {!categoriesQuery.isLoading && !categoriesQuery.isError && (
          <div className="card-admin overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 text-xs font-semibold text-primary uppercase tracking-wider">ID</th>
                    <th className="text-left p-4 text-xs font-semibold text-primary uppercase tracking-wider">Name</th>
                    <th className="text-left p-4 text-xs font-semibold text-primary uppercase tracking-wider">Description</th>
                    <th className="text-left p-4 text-xs font-semibold text-primary uppercase tracking-wider">Created</th>
                    <th className="text-left p-4 text-xs font-semibold text-primary uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(categoriesQuery.data ?? []).map((c) => (
                    <tr
                      key={c.id}
                      className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-4 text-sm text-primary font-medium">#{c.id}</td>
                      <td className="p-4 font-medium text-foreground">{c.name}</td>
                      <td className="p-4 text-sm text-muted-foreground">{c.description}</td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          disabled={deleteMutation.isPending}
                          onClick={() => {
                            const ok = window.confirm(`Delete category '${c.name}'?`);
                            if (!ok) return;
                            deleteMutation.mutate(c.id);
                          }}
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}

                  {(categoriesQuery.data?.length ?? 0) === 0 && (
                    <tr>
                      <td className="p-4 text-sm text-muted-foreground" colSpan={5}>
                        No categories found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CategoriesPage;

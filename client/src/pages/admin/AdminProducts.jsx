import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import confirmAction from "../../utils/confirmAction";

const initialForm = {
  title: "",
  description: "",
  category: "Tools",
  pricePerDay: "",
  availability: true,
  location: "",
  condition: "Good",
  image: "",
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [imageFile, setImageFile] = useState(null);

  const fetchProducts = () =>
    api
      .get("/products")
      .then((res) => setProducts(res.data))
      .finally(() => setLoading(false));

  useEffect(() => void fetchProducts(), []);

  const remove = async (id) => {
    const confirmed = confirmAction("Delete this product? This action cannot be undone.");
    if (!confirmed) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success("Product deleted");
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not delete product");
    }
  };

  const startEdit = (product) => {
    setEditingId(product._id);
    setForm({
      title: product.title || "",
      description: product.description || "",
      category: product.category || "Tools",
      pricePerDay: product.pricePerDay || "",
      availability: product.availability ?? true,
      location: product.location || "",
      condition: product.condition || "Good",
      image: product.image || "",
    });
    setImageFile(null);
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(initialForm);
    setImageFile(null);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.category || !form.pricePerDay) {
      return toast.error("Please fill all required fields");
    }
    if (Number(form.pricePerDay) <= 0) {
      return toast.error("Price per day must be greater than 0");
    }
    if (!imageFile && form.image && !/^https?:\/\//i.test(form.image)) {
      return toast.error("Image URL must start with http:// or https://");
    }

    setSaving(true);
    try {
      const payload = new FormData();
      payload.append("title", form.title);
      payload.append("description", form.description);
      payload.append("category", form.category);
      payload.append("pricePerDay", String(Number(form.pricePerDay)));
      payload.append("availability", String(form.availability));
      payload.append("location", form.location);
      payload.append("condition", form.condition);
      payload.append("image", form.image);
      if (imageFile) payload.append("image", imageFile);

      if (editingId) {
        await api.put(`/products/${editingId}`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Product updated");
      } else {
        await api.post("/products", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Product created");
      }
      resetForm();
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not save product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border-default bg-background-card p-4 shadow-soft">
        <h1 className="text-xl font-semibold">Product Management</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Add new rent-ready products, edit details, and control availability.
        </p>
      </div>

      <form onSubmit={submit} className="grid gap-3 rounded-2xl border border-border-default bg-background-card p-4 shadow-soft md:grid-cols-2">
        <input className="input-ui" placeholder="Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input className="input-ui" placeholder="Price per day *" type="number" min="1" value={form.pricePerDay} onChange={(e) => setForm({ ...form, pricePerDay: e.target.value })} />
        <textarea className="input-ui md:col-span-2" rows="3" placeholder="Description *" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input className="input-ui" placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
        <input
          className="input-ui file:mr-3 file:rounded file:border-0 file:bg-[var(--primary)] file:px-3 file:py-1 file:text-white"
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
        />
        <input className="input-ui" placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        <select className="input-ui" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
          {["Tools", "Electronics", "Camping Gear", "Books", "Cameras", "Sports", "Vehicles", "Others"].map((c) => <option key={c}>{c}</option>)}
        </select>
        <select className="input-ui" value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })}>
          {["New", "Like New", "Good", "Fair"].map((c) => <option key={c}>{c}</option>)}
        </select>
        <label className="flex items-center gap-2 text-sm text-text-secondary">
          <input type="checkbox" checked={form.availability} onChange={(e) => setForm({ ...form, availability: e.target.checked })} />
          Available for rent
        </label>
        <div className="flex gap-2 md:justify-end">
          {editingId && <button type="button" onClick={resetForm} className="btn-secondary px-3 py-2 text-sm">Cancel Edit</button>}
          <button disabled={saving} className="btn-primary px-3 py-2 text-sm disabled:opacity-60">{saving ? "Saving..." : editingId ? "Update Product" : "Create Product"}</button>
        </div>
      </form>

      <div className="overflow-x-auto rounded-2xl border border-border-default bg-background-card shadow-soft">
        {loading ? (
          <p className="p-4 text-text-secondary">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="p-4 text-text-secondary">No products found.</p>
        ) : (
          <table className="min-w-full table-fixed text-left text-sm">
            <thead className="bg-background-soft">
              <tr className="text-text-secondary">
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3 text-right">Price/Day</th>
                <th className="px-4 py-3 text-center">Available</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-t border-border-default">
                  <td className="px-4 py-3 text-text-primary truncate">{product.title}</td>
                  <td className="px-4 py-3 text-text-primary">{product.category}</td>
                  <td className="px-4 py-3 text-right text-text-primary">₹{product.pricePerDay}</td>
                  <td className="px-4 py-3 text-center text-text-primary              ">{product.availability ? "Yes" : "No"}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => startEdit(product)} className="btn-secondary px-3 py-1 text-xs">Edit</button>
                      <button onClick={() => remove(product._id)} className="rounded bg-[var(--danger)] px-3 py-1 text-xs text-white">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

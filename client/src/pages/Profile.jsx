import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import useAuth from "../context/useAuth";

export default function Profile() {
  const { user, login } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [form, setForm] = useState(null);
  const formState = form || {
    name: user?.name || "",
    phone: user?.phone || "",
    location: user?.location || "",
    image: user?.avatar || "",
  };

  const displayedAvatar = avatarPreview || formState.image || "https://ui-avatars.com/api/?name=User";

  const handleAvatarFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    setAvatarFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
    } else {
      setAvatarPreview("");
    }
  };

  const removeAvatarSelection = () => {
    setAvatarFile(null);
    setAvatarPreview("");
    setForm((prev) => ({ ...(prev || formState), image: "" }));
  };

  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  useEffect(() => {
    api
      .get("/orders/my")
      .then((res) => setOrders(res.data))
      .catch(() => {
        setOrders([]);
        setError("Could not load your orders.");
      })
      .finally(() => setLoading(false));
  }, []);

  const updateProfile = async (e) => {
    e.preventDefault();
    if (!formState.name.trim()) return toast.error("Name is required");

    setSaving(true);
    try {
      const payload = new FormData();
      payload.append("name", formState.name.trim());
      payload.append("phone", formState.phone.trim());
      payload.append("location", formState.location.trim());
      if (!avatarFile && formState.image) payload.append("image", formState.image);
      if (avatarFile) payload.append("image", avatarFile);

      const { data } = await api.put("/auth/profile", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      login({ user: data, token: data.token });
      setAvatarFile(null);
      setForm(null);
      toast.success("Profile updated");
    } catch (updateError) {
      toast.error(updateError.response?.data?.message || "Could not update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <form onSubmit={updateProfile} className="panel fade-in-up space-y-4 rounded-2xl p-5">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img src={displayedAvatar} alt="Profile" className="h-20 w-20 rounded-full object-cover ring-2 ring-[var(--primary-soft)]" />
              {avatarFile && (
                <span className="absolute -right-1 -top-1 rounded-full bg-red-500 px-2 text-[11px] font-semibold text-white">New</span>
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold">Profile Settings</h2>
              <p className="text-sm text-muted">{user?.email}</p>
            </div>
          </div>

          <input className="input-ui" placeholder="Full name" value={formState.name} onChange={(e) => setForm((prev) => ({ ...(prev || formState), name: e.target.value }))} />
          <input className="input-ui" placeholder="Phone number" value={formState.phone} onChange={(e) => setForm((prev) => ({ ...(prev || formState), phone: e.target.value }))} />
          <input className="input-ui" placeholder="Location" value={formState.location} onChange={(e) => setForm((prev) => ({ ...(prev || formState), location: e.target.value }))} />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-primary">Avatar Image</label>
            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <input
                className="input-ui"
                placeholder="Avatar URL (optional)"
                value={formState.image}
                onChange={(e) => setForm((prev) => ({ ...(prev || formState), image: e.target.value }))}
              />
              <button
                type="button"
                onClick={removeAvatarSelection}
                className="btn-secondary min-w-[120px] py-2"
              >
                Clear
              </button>
            </div>
            <label className="block text-sm font-medium text-text-primary">
              Upload image file
            </label>
            <input
              className="input-ui file:mr-3 file:rounded file:border-0 file:bg-[var(--primary)] file:px-3 file:py-1 file:text-white"
              type="file"
              accept="image/*"
              onChange={handleAvatarFileChange}
            />
            {avatarFile && (
              <p className="text-sm text-muted">Selected file: {avatarFile.name}</p>
            )}
          </div>

          <button disabled={saving} className="btn-primary w-full py-2 disabled:opacity-60">
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>

        <div className="panel fade-in rounded-2xl p-5">
          <h3 className="text-lg font-semibold">Account Snapshot</h3>
          <div className="mt-4 space-y-2 text-sm">
            <p><span className="text-muted">Role:</span> {user?.role || "user"}</p>
            <p><span className="text-muted">Email:</span> {user?.email || "-"}</p>
            <p><span className="text-muted">Phone:</span> {user?.phone || "Not set"}</p>
            <p><span className="text-muted">Location:</span> {user?.location || "Not set"}</p>
          </div>
        </div>
      </div>

      <div className="panel rounded-2xl p-5">
        <h3 className="mb-3 text-lg font-semibold">My Orders</h3>
        <div className="space-y-2">
          {loading ? (
            <p className="text-muted">Loading orders...</p>
          ) : error ? (
            <p style={{ color: "var(--danger)" }}>{error}</p>
          ) : orders.length === 0 ? (
            <p className="text-muted">You have no rental orders yet.</p>
          ) : (
            orders.map((order) => (
              <div key={order._id} className="rounded-xl border p-3" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
                <p className="font-medium">{order.product?.title}</p>
                <p className="text-sm text-muted">{order.status} • {order.rentalDays} day(s)</p>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

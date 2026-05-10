import { useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import useAuth from "../context/useAuth";

export default function Contact() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to send a message");
      return;
    }
    if (!formData.subject.trim() || !formData.message.trim()) {
      toast.error("Please fill all fields");
      return;
    }
    setIsSubmitting(true);
    try {
      await api.post("/contact", formData);
      toast.success("Message sent successfully!");
      setFormData({ subject: "", message: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    } finally {
      setIsSubmitting(false);
    }
  };
  const contactCards = [
    {
      title: "Customer Support",
      value: "support@rentify.com",
      note: "Product help, login issues, and order support.",
    },
    {
      title: "Partnerships",
      value: "partners@rentify.com",
      note: "Brand, city expansion, and growth partnerships.",
    },
    {
      title: "Call Us",
      value: "+91 90000 12345",
      note: "Mon-Sat, 10:00 AM to 7:00 PM",
    },
  ];

  return (
    <section className="space-y-8 fade-in-up">
      <div
        className="rounded-3xl border p-8 md:p-10"
        style={{ borderColor: "var(--border)", background: "linear-gradient(145deg, var(--surface), var(--bg-soft))" }}
      >
        <p className="inline-flex rounded-full px-3 py-1 text-xs font-semibold" style={{ background: "var(--primary-soft)", color: "var(--primary)" }}>
          Contact Rentify
        </p>
        <h1 className="mt-4 text-4xl font-black md:text-5xl">Let us build your best rental experience.</h1>
        <p className="mt-4 max-w-3xl text-base text-muted md:text-lg">
          Have questions, feedback, or ideas? Reach out and our team will help you quickly.
          We are committed to making renting smooth for both users and admins.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {contactCards.map((item) => (
          <article
            key={item.title}
            className="glow-on-hover rounded-2xl border p-5"
            style={{ borderColor: "var(--border)", background: "var(--surface)" }}
          >
            <h2 className="text-lg font-semibold">{item.title}</h2>
            <p className="mt-2 text-base font-medium text-[var(--primary)]">{item.value}</p>
            <p className="mt-2 text-sm text-muted">{item.note}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <form onSubmit={handleSubmit} className="rounded-2xl border p-6" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
          <h2 className="text-2xl font-bold">Send us a message</h2>
          <p className="mt-1 text-sm text-muted">We usually respond within 24 hours.</p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <input className="input-ui" placeholder="Your name" value={user?.name || ""} readOnly />
            <input className="input-ui" placeholder="Email address" type="email" value={user?.email || ""} readOnly />
            <input
              className="input-ui md:col-span-2"
              placeholder="Subject"
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
              required
            />
            <textarea
              className="input-ui md:col-span-2"
              rows="5"
              placeholder="Tell us how we can help..."
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              required
            />
          </div>
          <button type="submit" disabled={isSubmitting} className="btn-primary mt-4 px-5 py-2.5 text-sm disabled:opacity-50">
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </form>

        <div className="rounded-2xl border p-6" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
          <h2 className="text-2xl font-bold">Office & Hours</h2>
          <div className="mt-4 space-y-3 text-sm text-muted">
            <p><span className="font-semibold text-[var(--text)]">HQ:</span> Bengaluru, India</p>
            <p><span className="font-semibold text-[var(--text)]">Support Hours:</span> Mon-Sat, 10:00 AM - 7:00 PM</p>
            <p><span className="font-semibold text-[var(--text)]">Response Time:</span> Under 24 hours</p>
          </div>
          <div className="mt-5 rounded-xl border p-4" style={{ borderColor: "var(--border)", background: "var(--bg-soft)" }}>
            <p className="text-sm text-muted">
              Need urgent support? Mention <span className="font-semibold text-[var(--text)]">URGENT</span> in
              your email subject and our team will prioritize your request.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

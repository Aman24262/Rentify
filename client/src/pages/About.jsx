export default function About() {
  const pillars = [
    {
      title: "Affordable Access",
      description:
        "Use premium products only when you need them, without paying full ownership cost.",
    },
    {
      title: "Local Trust Network",
      description:
        "Connect with verified renters and owners nearby for safer and faster handovers.",
    },
    {
      title: "Sustainable Living",
      description:
        "Reduce overconsumption by sharing products and extending their useful lifecycle.",
    },
  ];

  const values = [
    "Transparent pricing with daily rental rates",
    "Simple and secure ordering flow",
    "Faster access to tools, cameras, electronics and more",
    "Community-first marketplace experience",
  ];

  return (
    <section className="space-y-8 fade-in-up">
      <div
        className="rounded-3xl border p-8 md:p-10"
        style={{ borderColor: "var(--border)", background: "linear-gradient(135deg, var(--surface), var(--bg-soft))" }}
      >
        <p className="inline-flex rounded-full px-3 py-1 text-xs font-semibold" style={{ background: "var(--primary-soft)", color: "var(--primary)" }}>
          About Rentify
        </p>
        <h1 className="mt-4 text-4xl font-black md:text-5xl">Borrow better. Own less. Live smarter.</h1>
        <p className="mt-4 max-w-3xl text-base text-muted md:text-lg">
          Rentify is a modern hyper-local rental platform helping people access quality products
          without buying them. From tools and cameras to camping gear and electronics, we make
          short-term usage affordable, convenient, and eco-friendly.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {pillars.map((item) => (
          <article
            key={item.title}
            className="glow-on-hover rounded-2xl border p-5"
            style={{ borderColor: "var(--border)", background: "var(--surface)" }}
          >
            <h2 className="text-lg font-semibold">{item.title}</h2>
            <p className="mt-2 text-sm text-muted">{item.description}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="rounded-2xl border p-6" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
          <h2 className="text-2xl font-bold">Our Mission</h2>
          <p className="mt-3 text-muted">
            We believe access is more valuable than ownership for many everyday products.
            Rentify helps people save money, reduce clutter, and build stronger local communities
            by making renting simple and reliable.
          </p>
          <p className="mt-3 text-muted">
            Whether you are a student, creator, traveler, or entrepreneur, Rentify lets you get
            what you need at the right time and price.
          </p>
        </div>
        <div className="rounded-2xl border p-6" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
          <h2 className="text-2xl font-bold">Why Users Love It</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            {values.map((value) => (
              <li key={value}>- {value}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

import { Instagram, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  const footerSections = [
    {
      title: "Platform",
      links: ["Browse Products", "How Renting Works", "Trust & Safety", "Pricing"],
    },
    {
      title: "Company",
      links: ["About Us", "Contact", "Careers", "Blog"],
    },
    {
      title: "Support",
      links: ["Help Center", "Terms of Use", "Privacy Policy", "FAQs"],
    },
  ];

  return (
    <footer className="mt-20 bg-background-main">
      <div className="mx-auto max-w-7xl px-4 py-16">
        {/* Gradient Accent Line */}
        <div className="mb-12 h-1 w-full bg-gradient-to-r from-primary-purple via-primary-indigo to-primary-cyan rounded-full"></div>

        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <h3 className="text-3xl font-black bg-gradient-to-r from-primary-purple to-primary-indigo bg-clip-text text-transparent">
              Rentify
            </h3>
            <p className="mt-4 max-w-sm text-text-secondary leading-relaxed">
              India's modern hyper-local rental marketplace for smarter access to products you
              need, exactly when you need them.
            </p>
            <div className="mt-6 flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-background-card p-3 text-text-secondary hover:bg-primary-purple hover:text-white transition-all duration-300 hover:scale-110"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-background-card p-3 text-text-secondary hover:bg-primary-purple hover:text-white transition-all duration-300 hover:scale-110"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-background-card p-3 text-text-secondary hover:bg-primary-purple hover:text-white transition-all duration-300 hover:scale-110"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-lg font-bold text-text-primary mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-text-secondary hover:text-primary-indigo transition-colors duration-300"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-border-default pt-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-text-secondary">
              © {new Date().getFullYear()} Rentify. Rent smarter, local first.
            </p>
            <p className="text-text-secondary">
              Built for communities that share more and waste less.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";
import { footerLinks } from "@/data/navigation";

export function Footer() {
  return (
    <footer className="bg-espresso text-bone">
      {/* Top */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr_1fr] gap-12">
        {/* Brand */}
        <div>
          <p className="font-heading text-2xl font-semibold mb-2">Synked.ai</p>
          <p className="text-bone/60 text-sm leading-relaxed">
            Sync Your Business with AI.
          </p>
        </div>

        {/* Company */}
        <div>
          <h5 className="font-mono text-xs uppercase tracking-[0.15em] text-bone/40 mb-4">
            Company
          </h5>
          <div className="flex flex-col gap-3">
            {footerLinks.company.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm text-bone/70 hover:text-bone transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Demos */}
        <div>
          <h5 className="font-mono text-xs uppercase tracking-[0.15em] text-bone/40 mb-4">
            Demos
          </h5>
          <div className="flex flex-col gap-3">
            {footerLinks.demos.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm text-bone/70 hover:text-bone transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Services */}
        <div>
          <h5 className="font-mono text-xs uppercase tracking-[0.15em] text-bone/40 mb-4">
            Services
          </h5>
          <div className="flex flex-col gap-3">
            {footerLinks.services.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm text-bone/70 hover:text-bone transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-bone/8 max-w-7xl mx-auto px-6 lg:px-12 py-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-bone/40">
        <span>© 2026 Synked.ai — All rights reserved.</span>
        <a
          href="mailto:hello@synked.ai"
          className="hover:text-bone transition-colors"
        >
          hello@synked.ai
        </a>
      </div>
    </footer>
  );
}

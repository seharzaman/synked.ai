import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { navLinks } from "@/data/navigation";

export function Navbar() {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 60);
          ticking = false;
        });
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[1000] flex items-center justify-between transition-all duration-300 ${
        scrolled
          ? "bg-[rgba(247,244,239,0.95)] backdrop-blur-[12px] shadow-[0_1px_0_rgba(0,0,0,0.08)]"
          : ""
      }`}
      style={{ height: "var(--nav-h)", padding: "0 5vw" }}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center no-underline">
        <img src="/logo.png" alt="Synked.ai" className="h-9 w-auto" />
      </Link>

      {/* Desktop links */}
      <div className="hidden lg:flex items-center gap-8">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            to={link.href}
            className={`relative text-[0.82rem] font-medium uppercase tracking-[0.07em] transition-all hover:opacity-100 after:absolute after:bottom-[-4px] after:left-0 after:h-[1.5px] after:bg-emerald after:transition-all after:duration-300 ${
              pathname === link.href
                ? "text-espresso opacity-100 after:w-full"
                : "text-espresso opacity-65 after:w-0 hover:after:w-full"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Desktop CTA */}
      <div className="hidden lg:block">
        <Button asChild className="uppercase tracking-[0.09em]">
          <Link to="/contact">Get Started</Link>
        </Button>
      </div>

      {/* Mobile menu */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-full bg-cream border-none flex flex-col items-center justify-center gap-8"
          >
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            {navLinks.map((link, i) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-2xl font-heading font-semibold transition-colors ${
                  pathname === link.href
                    ? "text-emerald"
                    : "text-espresso hover:text-emerald"
                }`}
                style={{
                  animation: `fadeUp 0.5s ease both`,
                  animationDelay: `${0.05 + i * 0.07}s`,
                }}
              >
                {link.label}
              </Link>
            ))}
            <Button asChild size="lg" className="mt-4">
              <Link to="/contact">Get Started</Link>
            </Button>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}

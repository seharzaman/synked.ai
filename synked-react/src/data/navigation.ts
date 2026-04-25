export const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "System Builder", href: "/demo-builder" },
  { label: "Dashboard", href: "/demo-dashboard" },
  { label: "Contact", href: "/contact" },
] as const;

export const footerLinks = {
  company: [
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Contact", href: "/contact" },
  ],
  demos: [
    { label: "System Builder", href: "/demo-builder" },
    { label: "Agent Dashboard", href: "/demo-dashboard" },
  ],
  services: [
    { label: "AI Agents", href: "/services#agents" },
    { label: "RAG Systems", href: "/services#rag" },
    { label: "Workflow Automation", href: "/services#workflow" },
    { label: "AI Management", href: "/services#management" },
  ],
} as const;

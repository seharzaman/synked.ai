interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionLabel({ children, className = "" }: SectionLabelProps) {
  return (
    <span
      className={`font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground ${className}`}
    >
      {children}
    </span>
  );
}

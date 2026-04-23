import { Settings } from "lucide-react";

interface DisclaimerBannerProps {
  text?: string;
  children?: React.ReactNode;
}

export function DisclaimerBanner({ text, children }: DisclaimerBannerProps) {
  return (
    <div className="bg-night-surf border border-night-bord rounded-lg px-5 py-4 flex items-start gap-3 max-w-5xl mx-auto mt-6 mb-8">
      <Settings className="size-5 text-pistachio shrink-0 mt-0.5" />
      <p className="text-night-hi/80 text-sm leading-relaxed">
        {children ?? text}
      </p>
    </div>
  );
}

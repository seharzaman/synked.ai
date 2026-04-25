import { Settings } from "lucide-react";

interface DisclaimerBannerProps {
  text?: string;
  children?: React.ReactNode;
}

export function DisclaimerBanner({ text, children }: DisclaimerBannerProps) {
  return (
    <div
      className="flex items-start gap-[0.8rem] px-[5vw] py-[0.9rem] border-b"
      style={{
        marginTop: "var(--nav-h)",
        background:
          "linear-gradient(135deg, rgba(127,140,67,.1), rgba(18,88,66,.1)), var(--color-off-white, #F7F4EF)",
        borderColor: "rgba(127,140,67,.22)",
      }}
    >
      <Settings className="size-5 text-pistachio shrink-0 mt-0.5" />
      <p
        className="text-[0.79rem] leading-[1.6]"
        style={{ color: "rgba(63,42,28,.62)" }}
      >
        {children ?? text}
      </p>
    </div>
  );
}

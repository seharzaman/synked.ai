import type { Metadata } from "next";
import { ContactPage } from "./ContactPage";

export const metadata: Metadata = {
  title: "Contact — Synked.ai",
  description:
    "Get in touch with Synked.ai. Let's understand your business and design the right AI system.",
};

export default function Page() {
  return <ContactPage />;
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await signIn.email({
      email,
      password,
    });

    if (error) {
      setError(error.message ?? "Something went wrong");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-emerald items-center justify-center">
        {/* Abstract pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 rounded-full border border-white/30" />
          <div className="absolute bottom-32 right-16 w-96 h-96 rounded-full border border-white/20" />
          <div className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full border border-white/25" />
        </div>

        <div className="relative z-10 max-w-md px-12 text-white">
          <div className="flex items-center gap-3 mb-10">
            <img
              src="/logo.png"
              alt="Synked.ai"
              className="h-10 w-auto brightness-0 invert"
            />
            <span className="text-2xl font-serif font-semibold tracking-tight">
              Synked.ai
            </span>
          </div>
          <h1 className="text-4xl font-serif font-bold leading-tight mb-6">
            Your AI-powered
            <br />
            <span className="italic text-bone">command center.</span>
          </h1>
          <p className="text-white/70 text-sm leading-relaxed font-sans">
            Manage your intelligent agents, monitor automations, and track
            performance — all from one unified dashboard built exclusively for
            your business.
          </p>
          <div className="mt-12 flex gap-8">
            <div>
              <div className="text-2xl font-mono font-bold">24/7</div>
              <div className="text-xs text-white/50 mt-1 uppercase tracking-wider">
                Always On
              </div>
            </div>
            <div>
              <div className="text-2xl font-mono font-bold">99.9%</div>
              <div className="text-xs text-white/50 mt-1 uppercase tracking-wider">
                Uptime
              </div>
            </div>
            <div>
              <div className="text-2xl font-mono font-bold">∞</div>
              <div className="text-xs text-white/50 mt-1 uppercase tracking-wider">
                Scalable
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center px-6 py-12 bg-off-white">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <img src="/logo.png" alt="Synked.ai" className="h-8 w-auto" />
            <span className="text-lg font-serif font-semibold">Synked.ai</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-serif font-bold text-espresso">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-espresso/60">
              Sign in to access your dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <Label
                htmlFor="email"
                className="text-espresso/80 text-xs uppercase tracking-wider"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 bg-white border-bone focus:border-emerald focus:ring-emerald/20"
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="password"
                className="text-espresso/80 text-xs uppercase tracking-wider"
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 bg-white border-bone focus:border-emerald focus:ring-emerald/20"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-emerald text-white hover:bg-emerald-lt text-sm uppercase tracking-wider font-medium"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-bone">
            <p className="text-xs text-espresso/50 leading-relaxed text-center font-mono">
              Only users with a custom dashboard provisioned by Synked.ai can
              log in. Contact us at{" "}
              <a
                href="mailto:hello@synked.ai"
                className="text-emerald hover:underline underline-offset-2"
              >
                hello@synked.ai
              </a>{" "}
              to get started.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

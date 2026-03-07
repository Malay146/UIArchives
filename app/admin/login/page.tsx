"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Background from "@/components/background";
import { Input } from "@/components/ui-components/Input";
import Button1 from "@/components/ui-components/Button1";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError("Please enter a password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Success! Cookie set HTTP-only.
        // Triggers middleware to re-evaluate auth status natively
        window.location.reload();
      } else {
        setError(data.error || "Incorrect password");
      }
    } catch (err) {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full relative min-h-screen bg-black text-white selection:bg-zinc-800 flex items-center justify-center">
      <Background />

      <main className="relative z-10 w-full max-w-md px-4 sm:px-6">
        <div className="bg-[#121212] rounded-3xl p-8 border border-zinc-800/50 shadow-2xl relative overflow-hidden">
          {/* Subtle noise and shine matching site aesthetics */}
          <div className="absolute inset-0 pattern-noise pointer-events-none mix-blend-overlay opacity-10"></div>

          <div className="text-center mb-8 relative z-10">
            <h1 className="text-3xl font-display font-bold text-white mb-2">
              Admin Panel
            </h1>
            <p className="text-zinc-400 text-sm">
              Please identify yourself to access UI Archives generators.
            </p>
          </div>

          <form
            onSubmit={handleLogin}
            className="flex flex-col gap-5 relative z-10"
          >
            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="text-xs text-zinc-500 uppercase tracking-wider pl-1"
              >
                Access Code
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                className="py-3 px-4 text-center tracking-[0.2em]"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm py-1 bg-red-900/20 border border-red-900/50 rounded-lg text-center">
                {error}
              </p>
            )}

            <Button1
              type="submit"
              disabled={loading}
              className="w-full justify-center py-3.5 mt-2"
            >
              {loading ? "Authenticating..." : "Enter Vault"}
            </Button1>
          </form>
        </div>
      </main>
    </div>
  );
}

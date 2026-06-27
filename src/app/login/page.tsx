"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HR_TEST_CREDENTIALS } from "@/lib/constants";
import { FormField } from "@/components/ui/form-field";
import { PasswordInput } from "@/components/ui/password-input";
import { Card, CardBody } from "@/components/ui/card";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password.");
      return;
    }

    // Full navigation ensures the session cookie is sent on the next request.
    window.location.href = "/dashboard";
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left Section */}
      <div className="hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-16 text-white lg:flex lg:flex-col lg:justify-between">
        <div>
            <Image
              src="/images/rove-hire-logo.png"
              alt="ROVE Hire"
              width={64}
              height={64}
              priority
              className="rounded-2xl shadow-xl"
            />

          <h1 className="mt-10 text-5xl font-bold tracking-tight">
            ROVE Hire
          </h1>

          <p className="mt-6 max-w-md text-lg leading-8 text-slate-300">
            Recruit smarter. Hire faster.
            <br />
            Manage candidates, interviews and offer letters from one beautiful
            dashboard.
          </p>

          <div className="mt-14 space-y-5 ">
            {[
              "Candidate Pipeline",
              "Interview Scheduling",
              "Offer Letter Generation",
              "Timeline Tracking",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                <span className="text-slate-200">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-sm text-slate-400">
          © 2026 ROVE • Internal HR Portal
        </p>
      </div>

      {/* Right Section */}
      <div className="flex items-center justify-center bg-slate-50 px-6 py-10">
  <Card className="w-full max-w-md border-slate-200 shadow-2xl">
    <CardBody className="p-8">
      {/* Mobile Logo */}
      <div className="mb-8 text-center lg:hidden">
        <Image
          src="/images/rove-hire-logo.png"
          alt="ROVE Hire"
          width={64}
          height={64}
          priority
          className="mx-auto rounded-lg"
        />

        <h1 className="mt-4 text-3xl font-bold tracking-tight">
          ROVE Hire
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Internal Recruitment Platform
        </p>
      </div>

      <header className="mb-8">
        <h2 className="text-4xl font-bold tracking-tight text-slate-900">
          Welcome Back
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Sign in to continue to your HR dashboard.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <fieldset
          disabled={loading}
          className="space-y-5"
        >
          <FormField
            label="Email"
            htmlFor="email"
            required
          >
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              autoFocus
              defaultValue={HR_TEST_CREDENTIALS.email}
              className="h-11"
            />
          </FormField>

          <FormField
            label="Password"
            htmlFor="password"
            required
          >
            <PasswordInput
              id="password"
              name="password"
              autoComplete="current-password"
              defaultValue={HR_TEST_CREDENTIALS.password}
              className="h-11"
            />
          </FormField>

          {error && (
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="h-11 w-full"
          >
            {loading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}

            {loading
              ? "Signing In..."
              : "Sign In"}
          </Button>
        </fieldset>
      </form>

      <div className="mt-8 border-t border-slate-100 pt-6">
        <p className="text-center text-xs text-slate-500">
          Secure access for ROVE HR Team
        </p>
      </div>
    </CardBody>
  </Card>
</div>
    </div>
  );
}
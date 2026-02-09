"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import {
  RiMailLine,
  RiLockPasswordLine,
  RiArrowRightLine,
  RiShieldUserLine,
} from "@remixicon/react";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/profile");
  };

  const handleAdminLogin = () => {
    router.push("/admin");
  };

  return (
    <div className="w-full">
      <div className="mb-10">
        <Link href="/" className="inline-block mb-4">
          <span className="font-display text-2xl font-bold text-primary">
            Vizit Africa
          </span>
        </Link>
        <h1 className="font-display text-4xl font-black uppercase text-foreground mb-2">
          Welcome Back
        </h1>
        <p className="text-muted-foreground text-lg font-light">
          Sign in to access your curated itinerary.
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>

          <InputGroup>
            <InputGroupInput
              id="email"
              type="email"
              placeholder="name@example.com"
              defaultValue="sarah@example.com"
            />
            <InputGroupAddon>
              <RiMailLine />
            </InputGroupAddon>
          </InputGroup>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href="#"
              className="text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
            >
              Forgot?
            </Link>
          </div>
          <InputGroup>
            <InputGroupInput
              id="password"
              type="password"
              placeholder="••••••••"
              defaultValue="password123"
            />
            <InputGroupAddon>
              <RiLockPasswordLine />
            </InputGroupAddon>
          </InputGroup>
        </div>

        <Button
          type="submit"
          className="w-full h-14 rounded-sm gap-2 text-base font-bold uppercase tracking-wide mt-4"
        >
          Sign In
          <RiArrowRightLine className="size-5" />
        </Button>
      </form>

      <div className="relative my-10">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border/40"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-widest font-medium">
          <span className="bg-background px-4 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={handleAdminLogin}
        className="w-full h-12 rounded-sm gap-2 text-sm font-medium border-border/50 hover:bg-muted/30"
      >
        <RiShieldUserLine className="size-4" />
        Admin Access
      </Button>

      <p className="text-center text-sm text-muted-foreground mt-8 font-light">
        New to Vizit Africa?{" "}
        <Link
          href="/signup"
          className="text-foreground font-medium underline underline-offset-4 hover:text-primary transition-colors"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}

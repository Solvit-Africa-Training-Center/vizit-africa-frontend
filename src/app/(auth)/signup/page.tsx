"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  RiMailLine,
  RiLockPasswordLine,
  RiArrowRightLine,
  RiUserLine,
} from "@remixicon/react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

export default function SignupPage() {
  const router = useRouter();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/profile");
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
          Start Your Journey
        </h1>
        <p className="text-muted-foreground text-lg font-light">
          Create an account to begin planning your legacy trip.
        </p>
      </div>

      <form onSubmit={handleSignup} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <InputGroup>
            <InputGroupInput id="name" type="text" placeholder="John Doe" />
            <InputGroupAddon>
              <RiUserLine />
            </InputGroupAddon>
          </InputGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <InputGroup>
            <InputGroupInput
              id="email"
              type="email"
              placeholder="name@example.com"
            />
            <InputGroupAddon>
              <RiMailLine />
            </InputGroupAddon>
          </InputGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <InputGroup>
            <InputGroupInput
              id="password"
              type="password"
              placeholder="Create a password"
            />
            <InputGroupAddon>
              <RiLockPasswordLine />
            </InputGroupAddon>
          </InputGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirm Password</Label>
          <InputGroup>
            <InputGroupInput
              id="confirm-password"
              type="password"
              placeholder="Confirm your password"
            />
            <InputGroupAddon>
              <RiLockPasswordLine />
            </InputGroupAddon>
          </InputGroup>
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            className="w-full h-14 rounded-sm gap-2 text-base font-bold uppercase tracking-wide"
          >
            Create Account
            <RiArrowRightLine className="size-5" />
          </Button>
        </div>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-8 font-light">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-foreground font-medium underline underline-offset-4 hover:text-primary transition-colors"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}

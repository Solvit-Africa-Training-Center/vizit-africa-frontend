"use client";

import { useGoogleLogin } from "@react-oauth/google";
import { RiGoogleFill } from "@remixicon/react";
import { useState } from "react";
import { toast } from "sonner";
import { googleLogin } from "@/actions/auth";
import { useRouter } from "@/i18n/navigation";
import { Button } from "../ui/button";

export function GoogleAuthButton({
  label = "Continue with Google",
}: {
  label?: string;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        const result = await googleLogin(tokenResponse.access_token);
        if (result.success) {
          toast.success("Successfully logged in with Google");
          router.push("/profile");
        } else {
          toast.error(result.error || "Google login failed");
        }
      } catch (error) {
        console.error("Google login error:", error);
        toast.error("An unexpected error occurred during Google login");
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      toast.error("Google login failed");
    },
  });

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full h-14 rounded-sm gap-2 text-base font-medium uppercase tracking-wide"
      onClick={() => login()}
      loading={isLoading}
      disabled={isLoading}
    >
      <RiGoogleFill className="size-5" />
      {label}
    </Button>
  );
}

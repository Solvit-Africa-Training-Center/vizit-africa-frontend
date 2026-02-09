"use client"
import { useForm } from "@tanstack/react-form"
import { toast } from "sonner"
import { registerBodySchema } from "@/lib/schema/auth-schema"
import { Label } from "../ui/label"
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group"
import { RiArrowRightLine, RiLockPasswordLine, RiMailLine, RiPhoneLine, RiUserLine } from "@remixicon/react"
import { Button } from "../ui/button"
import { useTranslations } from "next-intl"

export function RegisterForm() {
      const t = useTranslations("Auth.signup");
      const tCommon = useTranslations("Common");
  const form = useForm({
    defaultValues: {
        full_name: "",
        email: "",
        phone_number: "",
        password: "",
        re_password: "",
        role: "CLIENT",
    },
    validators: {
      onSubmit: registerBodySchema,
    },
    onSubmit: async ({ value }) => {
      console.log(value)
      toast.success("Form submitted successfully")
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className="space-y-6"
    >
        <div className="space-y-2">
          <Label htmlFor="full_name">{t("fullName")}</Label>
          <InputGroup>
            <InputGroupInput id="full_name" name="full_name" type="text" placeholder="John Doe" />
            <InputGroupAddon>
              <RiUserLine />
            </InputGroupAddon>
          </InputGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">{t("emailLabel")}</Label>
          <InputGroup>
            <InputGroupInput
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
            />
            <InputGroupAddon>
              <RiMailLine />
            </InputGroupAddon>
          </InputGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone_number">{t("phoneNumber")}</Label>
          <InputGroup>
            <InputGroupInput
              id="phone_number"
              name="phone_number"
              type="tel"
              placeholder="+251 912 345 678"
            />
            <InputGroupAddon>
              <RiPhoneLine />
            </InputGroupAddon>
          </InputGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">{t("passwordLabel")}</Label>
          <InputGroup>
            <InputGroupInput
              id="password"
              type="password"
              placeholder={tCommon("createAccount").split(" ")[0] + "..."}
            />
            <InputGroupAddon>
              <RiLockPasswordLine />
            </InputGroupAddon>
          </InputGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="re_password">{t("confirmPassword")}</Label>
          <InputGroup>
            <InputGroupInput
              id="re_password"
              name="re_password"
              type="password"
              placeholder={t("confirmPassword")}
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
            {tCommon("createAccount")}
            <RiArrowRightLine className="size-5" />
          </Button>
        </div>
      </form>
  )
}
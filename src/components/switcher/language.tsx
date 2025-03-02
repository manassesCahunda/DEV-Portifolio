"use client"

import { useMemo } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ReactCountryFlag from "react-country-flag";

const locales = [
  {
    code: "en",
    label: "English",
    flag: <ReactCountryFlag countryCode="GB" svg />,
  },
  {
    code: "pt",
    label: "Português",
    flag: <ReactCountryFlag countryCode="PT" svg />,
  },
]

export const LanguageSwitcher = () => {
  const router = useRouter()
  const pathname = usePathname()
  const currentLocale = pathname.split("/")[1] || "en"

  const handleValueChange = (newLocale: string) => {
    router.push(pathname.replace(/^\/(en|pt)/, `/${newLocale}`))
  }

  return (
    <Select defaultValue={currentLocale} onValueChange={handleValueChange}>
      <SelectTrigger className="w-[180px] bg-black text-white flex items-center gap-2">
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent>
        {locales.map(({ code, label, flag }) => (
          <SelectItem key={code} value={code} className="flex  justify-center items-center gap-2">
            {flag}
            <span className="pl-6">{label}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"

function getInitialTheme() {
  if (typeof window === "undefined") return "light"
  const stored = window.localStorage.getItem("theme")
  if (stored === "light" || stored === "dark") return stored
  const prefersDark =
    typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
  return prefersDark ? "dark" : "light"
}

export default function ThemeToggle({ className = "" }) {
  const [theme, setTheme] = React.useState(getInitialTheme)

  React.useEffect(() => {
    const root = document.documentElement
    if (theme === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
    window.localStorage.setItem("theme", theme)
  }, [theme])

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"))

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label={`Activate ${theme === "dark" ? "light" : "dark"} theme`}
      className={[
        "text-foreground/90 hover:bg-foreground/10 hover:text-foreground focus-visible:ring-primary",
        className,
      ].join(" ")}
    >
      {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
      <span className="sr-only">{theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}</span>
    </Button>
  )
}

import * as React from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Bell, Search, ChevronDown } from "lucide-react"
import ThemeToggle from "../theme-toggle"

/**
 * Theme-aware Netflix-style Navbar (pure JS)
 * - Plain <nav> list for links (no heavy mega menu).
 * - Right actions: Theme toggle, Search, Notifications, Avatar dropdown.
 * - Uses CSS variable-bound utilities: bg-background, text-foreground, border-border, ring-primary.
 *
 * Router integration:
 * - Pass LinkComponent={Link} (from react-router-dom) to enable client routing.
 * - Without LinkComponent, falls back to native <a> for preview environments.
 */
export default function Navbar({
  navItems = [
    { label: "Home", href: "/" },
    { label: "TV Shows", href: "/tv" },
    { label: "Movies", href: "/movies" },
    { label: "New & Popular", href: "/new" },
    { label: "My List", href: "/my-list" },
  ],
  user = null,
  avatarSrc,
  LinkComponent, // optional, e.g., from react-router-dom
} = {}) {
  const [scrolled, setScrolled] = React.useState(false)

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled
          ? "bg-background/80 backdrop-blur border-b border-border/40 shadow-sm"
          : "bg-gradient-to-b from-background/70 to-transparent",
      ].join(" ")}
      role="banner"
    >
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4 md:h-16 md:px-8">
        {/* Left: Brand + Main Nav */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* Brand */}
          <LinkAdapter
            LinkComponent={LinkComponent}
            href="/"
            className="inline-flex items-center gap-2 text-foreground"
            aria-label="Go to homepage"
          >
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-sm bg-red-600 text-[13px] font-black leading-none">
              N
            </span>
            <span className="hidden text-base font-semibold tracking-tight sm:inline">Netflix</span>
            <span className="sr-only">Home</span>
          </LinkAdapter>

          {/* Desktop nav */}
          <nav className="hidden md:block" aria-label="Primary">
            <ul className="flex items-center gap-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <LinkAdapter
                    LinkComponent={LinkComponent}
                    href={item.href}
                    className="rounded px-2 py-1 text-sm font-medium text-foreground/90 outline-none transition hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    {item.label}
                  </LinkAdapter>
                </li>
              ))}
            </ul>
          </nav>

          {/* Mobile: Browse dropdown */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 px-2 text-foreground/90 hover:bg-foreground/10 hover:text-foreground"
                  aria-label="Browse"
                >
                  Browse
                  <ChevronDown className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {navItems.map((item) => (
                  <DropdownMenuItem asChild key={item.href}>
                    <LinkAdapter LinkComponent={LinkComponent} href={item.href}>
                      {item.label}
                    </LinkAdapter>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1 md:gap-2">
          {/* Theme toggle */}
          <ThemeToggle />

          <IconButton ariaLabel="Search">
            <Search className="size-5" />
          </IconButton>

          <IconButton ariaLabel="Notifications" className="hidden sm:inline-flex">
            <Bell className="size-5" />
          </IconButton>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="group inline-flex items-center gap-2 rounded px-1 py-1 text-foreground/90 outline-none transition hover:bg-foreground/10 hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary"
                aria-label="User menu"
              >
                <Avatar className="size-7">
                  <AvatarImage
                    src={
                      avatarSrc ||
                      "/placeholder.svg?height=40&width=40&query=user avatar circle neutral"
                    }
                    alt="User avatar"
                  />
                  <AvatarFallback className="bg-foreground/10 text-xs text-foreground">U</AvatarFallback>
                </Avatar>
                <ChevronDown className="size-4 opacity-70 transition group-hover:opacity-100" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {user ? (
                <>
                  <DropdownMenuLabel className="truncate">{user.name ? user.name : "Account"}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <LinkAdapter LinkComponent={LinkComponent} href="/account">
                      Account
                    </LinkAdapter>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <LinkAdapter LinkComponent={LinkComponent} href="/help">
                      Help Center
                    </LinkAdapter>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <LinkAdapter LinkComponent={LinkComponent} href="/logout">
                      Sign out
                    </LinkAdapter>
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuLabel>Welcome</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <LinkAdapter LinkComponent={LinkComponent} href="/login">
                      Login
                    </LinkAdapter>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <LinkAdapter LinkComponent={LinkComponent} href="/signup">
                      Sign Up
                    </LinkAdapter>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

function LinkAdapter({ LinkComponent, href, children, className = "", ...props }) {
  if (LinkComponent) {
    const Comp = LinkComponent
    return (
      <Comp to={href} className={className} {...props}>
        {children}
      </Comp>
    )
  }
  return (
    <a href={href} className={className} {...props}>
      {children}
    </a>
  )
}

function IconButton({ children, ariaLabel, className = "" }) {
  return (
    <button
      aria-label={ariaLabel}
      className={[
        "inline-flex items-center justify-center rounded p-2 text-foreground/90 outline-none",
        "transition hover:bg-foreground/10 hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary",
        className,
      ].join(" ")}
      type="button"
    >
      {children}
    </button>
  )
}

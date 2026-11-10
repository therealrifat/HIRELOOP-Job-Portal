"use client"
import logo from '../../app/images/logo.png'
import Link from "next/link"

import { MenuIcon } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import Image from "next/image"
import { authClient } from '@/lib/auth-client'


const navLinks = [
  { label: "Browse Jobs", href: "/browse-jobs" },
  { label: "Company", href: "/company" },
  { label: "Pricing", href: "/pricing" },
]

function Logo() {
  return (
    <Link href="/" className="group/logo inline-flex items-center gap-0.5">
     <Image src={logo} height={100} width={100} alt="logo"/>
    </Link>
  )
}

function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Open menu"
          />
        }
      >
        <MenuIcon />
      </SheetTrigger>
      <SheetContent side="right" className="w-72">
        <SheetHeader>
          <SheetTitle className="flex items-center text-foreground">
            <SheetClose render={<Logo />} />
          </SheetTitle>
          <SheetDescription className="sr-only">Hireloop navigation</SheetDescription>
        </SheetHeader>

        <nav className="flex flex-col gap-1 px-4">
          {navLinks.map((link) => (
            <SheetClose
              key={link.href}
              render={<Link href={link.href} />}
              className="rounded-lg px-2 py-2 text-sm font-medium text-foreground/80 hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </SheetClose>
          ))}
        </nav>

        <SheetFooter>
          <SheetClose
            render={
              <Link
                href="/sign-in"
                className={buttonVariants({ variant: "outline", className: "w-full" })}
              />
            }
          >
            Sign In
          </SheetClose>
          <SheetClose
            render={
              <Link
                href="/get-started"
                className={buttonVariants({
                  className:
                    "w-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 text-white hover:from-violet-600 hover:to-indigo-600",
                })}
              />
            }
          >
            Get Started
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export default function Navbar() {
  const handleSignOut = async()=>{
    await authClient.signOut();
  }

  const { data: session } = authClient.useSession()
  return (
    <header className="sticky top-0 z-50 w-full p-3 sm:p-4">
      <nav className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between rounded-2xl border border-border/50 bg-card/80 px-4 shadow-sm backdrop-blur-md supports-backdrop-filter:bg-card/60 sm:px-6">
        <Logo />

        <div className="flex items-center gap-2">
          <ul className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="rounded-lg px-3 py-1.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted/50 hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-3 md:flex">
            <Separator
              orientation="vertical"
              className="data-vertical:h-5 data-vertical:self-center"
            />
           {session?.user ? <> 
            <span>Wellcome , {session?.user.name}</span>
          <Button
              className="rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 text-white hover:from-violet-600 hover:to-indigo-600"
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
           </>: <>
            <Link
              href="/sign-in"
              className="px-2 text-sm font-medium text-indigo-400 transition-colors hover:text-indigo-300"
            >
              Sign In
            </Link>
           </>}
            <Button
              className="rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 text-white hover:from-violet-600 hover:to-indigo-600"
              render={<Link href="/get-started" />}
            >
              Get Started
            </Button>
          </div>

          <MobileNav />
        </div>
      </nav>
    </header>
  )
}

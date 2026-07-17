"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Container from "./shared/container";
import { ModeToggle } from "./ui/theme-toggle";

const NAV_ITEMS = {
  about: "/",
  news: "/news",
  publications: "/publications",
  experience: "/experience",
};

export const Header = () => {
  const pathname = usePathname();

  return (
    <header>
      <Container size="large">
        <nav
          className="flex flex-col fade items-center md:items-start justify-start py-8 tracking-tight w-full sm:pr-0 md:pr-6 lg:pr-0"
          aria-label="Main navigation"
        >
          <div className="flex flex-row items-center">
            <Link href="/">
              <Image
                src="/profile.JPG"
                alt="Mustafa Sameen"
                width={100}
                height={100}
                priority={true}
                sizes="100px"
                className="rounded-full border border-neutral-200 object-cover shadow-sm dark:border-neutral-800"
              />
              <span className="sr-only">Mustafa Sameen</span>
            </Link>

            <div className="ml-4 flex flex-col">
              <span className="text-lg font-semibold tracking-tight">
                Mustafa Sameen
              </span>
              <span className="text-sm text-neutral-500 dark:text-neutral-400">
                PhD student
              </span>
              <span className="text-sm text-neutral-500 dark:text-neutral-400">
                University of Florida
              </span>
            </div>
          </div>

          <div className="flex flex-row flex-wrap items-center justify-center sm:justify-end gap-y-1 w-full mt-8 sm:mt-4 mb-0 sm:mb-4 tracking-tight">
            <div className="flex flex-wrap items-center justify-center">
              {Object.entries(NAV_ITEMS).map(([name, href]) => (
                <Link
                  key={name}
                  href={href}
                  aria-current={pathname === href ? "page" : undefined}
                  className={cn(
                    pathname === href
                      ? "font-semibold text-emerald-900 dark:text-emerald-200"
                      : "font-normal",
                    "transition-all hover:text-emerald-900 dark:hover:text-emerald-100 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/30 rounded-md flex align-middle relative py-1 px-2"
                  )}
                >
                  {name}
                </Link>
              ))}
              <a
                href="/CV.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="font-normal transition-all hover:text-emerald-900 dark:hover:text-emerald-100 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/30 rounded-md flex align-middle relative py-1 px-2"
              >
                cv
              </a>
            </div>
            <ModeToggle />
          </div>
        </nav>
      </Container>
    </header>
  );
};

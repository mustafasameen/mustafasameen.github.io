import IconGithub from "./shared/icons/github";
import IconLinkedin from "./shared/icons/linkedin";
import IconMail from "./shared/icons/mail";
import IconScholar from "./shared/icons/scholar";

import Link from "next/link";
import { ReactNode } from "react";

function SocialLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      rel="noopener noreferrer"
      target="_blank"
      className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/80 px-4 py-1.5 text-sm font-medium tracking-tight text-neutral-700 no-underline shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50/60 hover:text-emerald-900 dark:border-neutral-800 dark:bg-neutral-900/40 dark:text-neutral-200 dark:hover:border-emerald-700/60 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-100"
    >
      {children}
    </Link>
  );
}

export default function Social() {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      <SocialLink href="https://github.com/mustafasameen">
        <IconGithub />
        GitHub
      </SocialLink>
      <SocialLink href="https://scholar.google.com/citations?user=a8DWRtUAAAAJ&hl=en">
        <IconScholar />
        Scholar
      </SocialLink>
      <SocialLink href="https://www.linkedin.com/in/mustafasameen/">
        <IconLinkedin />
        LinkedIn
      </SocialLink>
      <SocialLink href="mailto:mustafasameen@ufl.edu">
        <IconMail />
        Email
      </SocialLink>
    </div>
  );
}

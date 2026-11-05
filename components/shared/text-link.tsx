import { ReactNode } from "react";

type TextLinkProps = {
  href: string;
  children: ReactNode;
};

export default function TextLink({ href, children }: TextLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium underline decoration-from-font underline-offset-[3px] text-emerald-950 decoration-emerald-500/60 transition-colors hover:text-emerald-800 hover:decoration-emerald-600 dark:text-emerald-50 dark:decoration-emerald-400/60 dark:hover:text-emerald-300 dark:hover:decoration-emerald-300 tracking-tight"
    >
      {children}
    </a>
  );
}

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
      className="font-medium underline decoration-from-font text-emerald-950 decoration-emerald-500 transition-colors hover:text-emerald-800 dark:text-emerald-50 dark:decoration-emerald-400 dark:hover:text-emerald-300 tracking-tight"
    >
      {children}
    </a>
  );
}
